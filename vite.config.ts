import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'github-api-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && (req.url === '/api/github' || req.url.startsWith('/api/github?'))) {
              try {
                const username = env.GITHUB_USERNAME || 'kitzroca';
                const token = env.GITHUB_TOKEN || '';
                const repo = 'portfolio';

                const headers: Record<string, string> = {
                  Accept: 'application/vnd.github+json',
                  'User-Agent': 'Portfolio-Dev-Server',
                };
                if (token) {
                  headers.Authorization = `Bearer ${token}`;
                }

                // 1. Fetch user profile and repo commits
                const [profileRes, commitsRes] = await Promise.allSettled([
                  fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }).then((r) =>
                    r.ok ? r.json() : null
                  ),
                  fetch(
                    `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo)}/commits?per_page=100`,
                    { headers }
                  ).then((r) => (r.ok ? r.json() : null)),
                ]);

                const profileData = profileRes.status === 'fulfilled' && profileRes.value ? profileRes.value : {};
                const rawCommits = commitsRes.status === 'fulfilled' && commitsRes.value ? commitsRes.value : [];

                const dateCountMap: Record<string, number> = {};
                const parsedCommits = Array.isArray(rawCommits)
                  ? rawCommits.map((c: any) => {
                      const d = c.commit?.author?.date || c.commit?.committer?.date || '';
                      if (d) {
                        const dateKey = d.slice(0, 10);
                        dateCountMap[dateKey] = (dateCountMap[dateKey] || 0) + 1;
                      }
                      return {
                        sha: (c.sha || '').slice(0, 7),
                        message: c.commit?.message?.split('\n')[0] || 'Commit',
                        repo,
                        date: d.slice(0, 10),
                        url: c.html_url || `https://github.com/${username}/${repo}/commit/${c.sha}`,
                      };
                    })
                  : [];

                // 2. Fetch GraphQL contribution days if token available
                if (token) {
                  try {
                    const query = `query {
                      user(login: "${username}") {
                        contributionsCollection {
                          totalCommitContributions
                          contributionCalendar {
                            totalContributions
                            weeks {
                              contributionDays {
                                date
                                contributionCount
                              }
                            }
                          }
                        }
                      }
                    }`;
                    const gqlRes = await fetch('https://api.github.com/graphql', {
                      method: 'POST',
                      headers: { ...headers, 'Content-Type': 'application/json' },
                      body: JSON.stringify({ query }),
                    });
                    if (gqlRes.ok) {
                      const gqlData: any = await gqlRes.json();
                      const weeks = gqlData.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
                      for (const w of weeks) {
                        for (const day of w.contributionDays || []) {
                          if (day.contributionCount > 0) {
                            dateCountMap[day.date] = Math.max(dateCountMap[day.date] || 0, day.contributionCount);
                          }
                        }
                      }
                    }
                  } catch {
                    /* ignore */
                  }
                }

                // 3. Build 53x7 matrix
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

                const totalCommits = parsedCommits.length;
                const displayTotal = `${totalCommits} COMMITS`;

                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    profile: {
                      username: profileData.login || username,
                      display_name: profileData.name || username,
                      avatar_url: profileData.avatar_url || '',
                      public_repos: profileData.public_repos ?? 1,
                      followers: profileData.followers ?? 0,
                      following: profileData.following ?? 0,
                      github_url: `https://github.com/${username}`,
                    },
                    contributions: {
                      total: totalCommits,
                      commits: totalCommits,
                      display_total: displayTotal,
                      display_commits: displayTotal,
                    },
                    heatmap: {
                      matrix,
                      progress: 100,
                    },
                    activity_stats: {
                      recent_label: 'ACTIVE',
                      total_label: displayTotal,
                    },
                    commits: parsedCommits,
                  })
                );
                return;
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Failed to proxy github API', details: String(err) }));
                return;
              }
            }
            next();
          });
        },
      },
    ],
    envPrefix: ['VITE_', 'REACT_APP_'],
    server: {
      port: 5173,
    },
  };
});
