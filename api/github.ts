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

function getFallbackData(username: string) {
  const emptyMatrix = Array.from({ length: 4 }, () => Array(28).fill(0));
  return {
    profile: {
      username: username || 'github',
      display_name: 'N/A',
      avatar_url: '',
      public_repos: 0,
      followers: 0,
      following: 0,
      github_url: `https://github.com/${username || ''}`,
    },
    contributions: {
      total: 0,
      commits: 0,
      display_total: 'N/A',
      display_commits: 'N/A',
    },
    heatmap: {
      matrix: emptyMatrix,
      progress: 0,
    },
    activity_stats: {
      recent_label: 'N/A',
      total_label: 'N/A',
    },
  };
}

function buildHeatmap(weeks: Array<{ contributionDays?: Array<{ contributionLevel: string }> }>) {
  const levelMap: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 3,
  };

  const matrix = Array.from({ length: 4 }, () => Array(52).fill(0));
  if (!weeks || weeks.length === 0) return matrix;

  const weeksSlice = weeks.slice(-52);
  const rowDayMap: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4 };

  weeksSlice.forEach((week, colIndex) => {
    if (!week.contributionDays) return;
    const days = week.contributionDays;
    for (let row = 0; row < 4; row++) {
      const dayPos = rowDayMap[row];
      if (days[dayPos]) {
        const lvlStr = days[dayPos].contributionLevel || 'NONE';
        matrix[row][colIndex] = levelMap[lvlStr] ?? 0;
      }
    }
  });

  return matrix;
}

function getRecentLabel(weeks: Array<{ contributionDays?: Array<{ contributionCount: number }> }>) {
  if (!weeks || weeks.length === 0) return 'ACTIVE';
  const recentWeeks = weeks.slice(-2);
  let recentCount = 0;

  for (const week of recentWeeks) {
    if (week.contributionDays) {
      for (const day of week.contributionDays) {
        recentCount += day.contributionCount || 0;
      }
    }
  }

  return recentCount > 0 ? 'ACTIVE' : 'IDLE';
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const username = process.env.GITHUB_USERNAME || 'kitzroca';
  const token = process.env.GITHUB_TOKEN;

  // Set edge caching headers (1 hour cache, stale-while-revalidate 10 minutes)
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': `Portfolio-React-App/${username}`,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // 1. Fetch REST Profile
    const profileRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
    });

    let profileData: any = {};
    if (profileRes.ok) {
      profileData = await profileRes.json();
    }

    // 2. Fetch GraphQL Contributions (requires token)
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
    }

    // Assemble response
    const resolvedUsername = profileData.login || username;
    const displayName = profileData.name || resolvedUsername;
    const avatarUrl = profileData.avatar_url || '';
    const publicRepos = profileData.public_repos ?? 0;
    const followers = profileData.followers ?? 0;
    const following = profileData.following ?? 0;
    const githubUrl = profileData.html_url || `https://github.com/${resolvedUsername}`;

    let totalContributions = 0;
    let commitContributions = 0;
    let weeks: any[] = [];

    if (collection) {
      totalContributions = collection.totalContributions?.totalContributions ?? 0;
      commitContributions = collection.totalCommitContributions ?? 0;
      weeks = collection.totalContributions?.weeks ?? [];
    } else {
      // Fallback: Fetch public contributions without requiring GITHUB_TOKEN
      try {
        const publicContribRes = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
        );
        if (publicContribRes.ok) {
          const publicData: any = await publicContribRes.json();
          totalContributions = publicData.total?.lastYear ?? 0;
          commitContributions = totalContributions;
          const days: Array<{ date: string; count: number; level: number }> = publicData.contributions || [];

          let curWeek: any[] = [];
          weeks = [];
          const levelStrings = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];

          days.forEach((d) => {
            curWeek.push({
              date: d.date,
              contributionCount: d.count,
              contributionLevel: levelStrings[Math.min(Math.max(d.level, 0), 4)],
            });
            if (new Date(d.date).getDay() === 6) {
              weeks.push({ contributionDays: curWeek });
              curWeek = [];
            }
          });
          if (curWeek.length > 0) {
            weeks.push({ contributionDays: curWeek });
          }
        }
      } catch (e) {
        console.warn('Fallback public contributions fetch failed:', e);
      }
    }

    const heatmapMatrix = buildHeatmap(weeks);
    const progress = totalContributions > 0 ? Math.min(100, Math.max(2, Math.round((totalContributions / 100) * 100))) : 0;
    const contribDisplay = totalContributions > 0 ? totalContributions.toLocaleString() : '2';
    const commitDisplay = commitContributions > 0 ? commitContributions.toLocaleString() : '2';
    const recentLabel = getRecentLabel(weeks);

    return res.status(200).json({
      profile: {
        username: resolvedUsername,
        display_name: displayName,
        avatar_url: avatarUrl,
        public_repos: publicRepos,
        followers,
        following,
        github_url: githubUrl,
      },
      contributions: {
        total: totalContributions,
        commits: commitContributions,
        display_total: contribDisplay,
        display_commits: commitDisplay,
      },
      heatmap: {
        matrix: heatmapMatrix,
        progress,
      },
      activity_stats: {
        recent_label: recentLabel,
        total_label: totalContributions > 0 ? `${contribDisplay} CONTRIBUTIONS` : 'N/A',
      },
    });
  } catch (error) {
    console.error('API /api/github error:', error);
    return res.status(200).json(getFallbackData(username));
  }
}
