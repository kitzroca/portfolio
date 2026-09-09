import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        totalCommitContributions: number;
        totalContributions: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
              contributionLevel: string;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

function formatCommitDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    if (diffHours < 24 && now.getDate() === date.getDate()) {
      return 'Today';
    }
    if (diffHours < 48) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

/**
 * Maps contribution counts grouped by date into 53 weeks × 7 rows calendar matrix.
 */
function buildMatrixFromDateMap(dateCountMap: Record<string, number>): number[][] {
  const totalWeeks = 53;
  const matrix: number[][] = Array.from({ length: 7 }, () => Array(totalWeeks).fill(0));
  const today = new Date();

  const dayOfWeek = today.getUTCDay();
  const startDate = new Date(today);
  startDate.setUTCDate(today.getUTCDate() - (dayOfWeek + (totalWeeks - 1) * 7));

  for (let w = 0; w < totalWeeks; w++) {
    for (let r = 0; r < 7; r++) {
      const cellDate = new Date(startDate);
      cellDate.setUTCDate(startDate.getUTCDate() + (w * 7 + r));

      if (cellDate > today) {
        matrix[r][w] = 0;
        continue;
      }

      const dateKey = cellDate.toISOString().slice(0, 10);
      const count = dateCountMap[dateKey] || 0;

      let level = 0;
      if (count >= 10) level = 4;
      else if (count >= 6) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      matrix[r][w] = level;
    }
  }

  return matrix;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const username = process.env.GITHUB_USERNAME || 'kitzroca';
  const repo = 'portfolio';
  const token = process.env.GITHUB_TOKEN;

  // Set edge caching headers (10 minutes cache, stale-while-revalidate 5 minutes)
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': `Portfolio-React-App/${username}`,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // 1. Fetch REST Profile & Real Repository Commits in parallel
    const [profileRes, commitsRes] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo)}/commits?per_page=100`, {
        headers,
      }).then((r) => (r.ok ? r.json() : null)),
    ]);

    const profileData = profileRes.status === 'fulfilled' && profileRes.value ? profileRes.value : {};
    const rawCommits = commitsRes.status === 'fulfilled' && commitsRes.value ? commitsRes.value : null;

    let parsedCommits: any[] = [];
    const dateCountMap: Record<string, number> = {};

    if (Array.isArray(rawCommits)) {
      parsedCommits = rawCommits.map((c: any) => {
        const commitDateStr = c.commit?.author?.date || c.commit?.committer?.date || '';
        if (commitDateStr) {
          const dateKey = commitDateStr.slice(0, 10);
          dateCountMap[dateKey] = (dateCountMap[dateKey] || 0) + 1;
        }

        return {
          sha: (c.sha || '').slice(0, 7),
          message: c.commit?.message?.split('\n')[0] || 'Commit',
          repo,
          date: formatCommitDate(commitDateStr),
          url: c.html_url || `https://github.com/${username}/${repo}/commit/${c.sha}`,
        };
      });
    }

    // 2. Fetch GraphQL Contributions (for full user calendar) if token is provided
    let collection: any = null;
    if (token) {
      const now = new Date();
      const to = now.toISOString();
      const fromDate = new Date(now.getTime() - 52 * 7 * 24 * 60 * 60 * 1000);
      const from = fromDate.toISOString();

      const query = `
        query($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              totalContributions: contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const graphqlRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { login: username, from, to },
          }),
        });

        if (graphqlRes.ok) {
          const gqlData: GitHubGraphQLResponse = await graphqlRes.json();
          if (!gqlData.errors && gqlData.data?.user?.contributionsCollection) {
            collection = gqlData.data.user.contributionsCollection;
          }
        }
      } catch (e) {
        console.warn('GraphQL fetch warning:', e);
      }
    }

    if (collection?.totalContributions?.weeks) {
      for (const week of collection.totalContributions.weeks) {
        if (week.contributionDays) {
          for (const day of week.contributionDays) {
            if (day.contributionCount > 0) {
              dateCountMap[day.date] = Math.max(dateCountMap[day.date] || 0, day.contributionCount);
            }
          }
        }
      }
    }

    const totalRepoCommits = parsedCommits.length;
    const totalUserCommits = collection?.totalCommitContributions ?? totalRepoCommits;
    const totalContributions = collection?.totalContributions?.totalContributions ?? Math.max(totalRepoCommits, totalUserCommits);

    const displayCommits = Math.max(totalRepoCommits, totalContributions);
    const displayLabel = `${displayCommits} COMMITS`;

    const matrix = buildMatrixFromDateMap(dateCountMap);

    const resolvedUsername = profileData.login || username;
    const displayName = profileData.name || resolvedUsername;
    const avatarUrl = profileData.avatar_url || '';
    const publicRepos = profileData.public_repos ?? 1;
    const followers = profileData.followers ?? 0;
    const following = profileData.following ?? 0;
    const githubUrl = profileData.html_url || `https://github.com/${resolvedUsername}`;

    return res.status(200).json({
      profile: {
        username: resolvedUsername,
        display_name: displayName,
        avatar_url: avatarUrl,
        public_repos: Math.max(publicRepos, 1),
        followers,
        following,
        github_url: githubUrl,
      },
      contributions: {
        total: displayCommits,
        commits: displayCommits,
        display_total: displayLabel,
        display_commits: displayLabel,
      },
      heatmap: {
        matrix,
        progress: 100,
      },
      activity_stats: {
        recent_label: 'ACTIVE',
        total_label: displayLabel,
      },
      commits: parsedCommits,
    });
  } catch (error) {
    console.error('API /api/github error:', error);
    return res.status(500).json({
      error: 'Failed to fetch live GitHub data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
