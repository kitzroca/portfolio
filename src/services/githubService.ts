import { GitHubData, GitHubCommitItem } from '../types/github';

const DEFAULT_USERNAME = 'kitzroca';
const DEFAULT_REPO = 'portfolio';
const CACHE_KEY = 'gh_activity_data_v3';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache to respect GitHub rate limits

/**
 * Formats an ISO date string into human-friendly relative date.
 */
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
 * Maps an array of date-grouped contribution counts into a 53-week × 7-row matrix
 * matching GitHub's official contribution calendar (Sun=0 to Sat=6).
 * Intensity levels:
 * 0: 0 contributions
 * 1: 1-2 contributions
 * 2: 3-5 contributions
 * 3: 6-9 contributions
 * 4: 10+ contributions (or level 3 for bright green)
 */
export function buildLiveMatrixFromDateMap(dateCountMap: Record<string, number>): number[][] {
  const totalWeeks = 53;
  const matrix: number[][] = Array.from({ length: 7 }, () => Array(totalWeeks).fill(0));
  const today = new Date();

  // Find the start date: Sunday of the week that started 52 weeks ago
  const dayOfWeek = today.getUTCDay(); // 0=Sun..6=Sat
  const startDate = new Date(today);
  startDate.setUTCDate(today.getUTCDate() - (dayOfWeek + (totalWeeks - 1) * 7));

  for (let w = 0; w < totalWeeks; w++) {
    for (let r = 0; r < 7; r++) {
      const cellDate = new Date(startDate);
      cellDate.setUTCDate(startDate.getUTCDate() + (w * 7 + r));

      // Don't mark future days if beyond today
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

/**
 * Builds matrix from explicit list of contribution days (e.g. from GraphQL or scraper API).
 */
export function buildContributionMatrixFromDays(
  contributions: Array<{ date: string; count: number; level: number }>
): number[][] {
  const dateMap: Record<string, number> = {};
  contributions.forEach((c) => {
    dateMap[c.date] = c.count;
  });
  return buildLiveMatrixFromDateMap(dateMap);
}

/**
 * Creates an empty/neutral 7-row × 53-week matrix when waiting for live data.
 */
export function createEmptyMatrix(): number[][] {
  return Array.from({ length: 7 }, () => Array(53).fill(0));
}

/**
 * Direct client-side fetch from public GitHub API.
 * Uses public endpoints:
 * - https://api.github.com/users/{username}
 * - https://api.github.com/repos/{username}/{repo}/commits?per_page=100
 * No token is exposed in the frontend code.
 */
async function fetchClientGitHub(username: string = DEFAULT_USERNAME, repo: string = DEFAULT_REPO): Promise<GitHubData> {
  const headers = { Accept: 'application/vnd.github+json' };

  const [profileRes, commitsRes, contribRes] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }).then((r) =>
      r.ok ? r.json() : null
    ),
    fetch(`https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo)}/commits?per_page=100`, {
      headers,
    }).then((r) => (r.ok ? r.json() : null)),
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`).then((r) =>
      r.ok ? r.json() : null
    ),
  ]);

  const profile = profileRes.status === 'fulfilled' && profileRes.value ? profileRes.value : {};
  const rawCommits = commitsRes.status === 'fulfilled' && commitsRes.value ? commitsRes.value : null;
  const contribData = contribRes.status === 'fulfilled' && contribRes.value ? contribRes.value : {};

  // Parse commits if returned
  let parsedCommits: GitHubCommitItem[] = [];
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
        repo: repo,
        date: formatCommitDate(commitDateStr),
        url: c.html_url || `https://github.com/${username}/${repo}/commit/${c.sha}`,
      };
    });
  }

  // Also integrate jogruber contribution days if available
  const jogruberDays: Array<{ date: string; count: number; level: number }> = contribData.contributions || [];
  jogruberDays.forEach((d) => {
    if (d.count > 0) {
      dateCountMap[d.date] = Math.max(dateCountMap[d.date] || 0, d.count);
    }
  });

  const totalCommitsCount = parsedCommits.length;
  const jogruberTotal = contribData.total?.lastYear ?? 0;
  const liveTotal = Math.max(totalCommitsCount, jogruberTotal);

  // If live data couldn't be loaded at all (e.g. rate-limited and no cache), throw so caller handles it
  if (totalCommitsCount === 0 && jogruberTotal === 0 && !profile.login) {
    throw new Error('GitHub API rate limit reached or network unavailable.');
  }

  // Build 53x7 matrix from real activity dates
  const matrix = buildLiveMatrixFromDateMap(dateCountMap);

  const displayTotal = `${liveTotal} COMMITS`;

  return {
    profile: {
      username: profile.login || username,
      display_name: profile.name || profile.login || username,
      avatar_url: profile.avatar_url || '',
      public_repos: profile.public_repos ?? 1,
      followers: profile.followers ?? 0,
      following: profile.following ?? 0,
      github_url: `https://github.com/${username}`,
    },
    contributions: {
      total: liveTotal,
      commits: liveTotal,
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
  };
}

/**
 * Main fetch function:
 * 1. Checks sessionStorage cache (valid for 5 mins) to prevent burning API rate limits.
 * 2. Tries backend `/api/github` (e.g. on Vercel or local proxy with GITHUB_TOKEN).
 * 3. Tries client-side direct public GitHub API fetch.
 * 4. Saves fresh live data into sessionStorage.
 */
export async function fetchGitHubData(
  username: string = DEFAULT_USERNAME,
  repo: string = DEFAULT_REPO
): Promise<GitHubData | null> {
  // Check session cache first
  try {
    const cachedStr = sessionStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
        return parsed.data as GitHubData;
      }
    }
  } catch {
    // SessionStorage may fail in restricted/private browsing modes
  }

  // 1. Try serverless backend endpoint (/api/github)
  try {
    const res = await fetch('/api/github');
    if (res.ok) {
      const data: GitHubData = await res.json();
      if (data && data.contributions && data.contributions.display_total && data.contributions.display_total !== 'N/A') {
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
        } catch {
          /* ignore */
        }
        return data;
      }
    }
  } catch {
    // API endpoint unreachable (e.g. standalone Vite dev server without proxy running)
  }

  // 2. Direct public client fetch fallback
  try {
    const data = await fetchClientGitHub(username, repo);
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    } catch {
      /* ignore */
    }
    return data;
  } catch (error) {
    console.warn('Could not load live GitHub API data:', error);
    return null;
  }
}
