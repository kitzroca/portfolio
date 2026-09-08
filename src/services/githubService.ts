import { GitHubData, GitHubCommitItem } from '../types/github';

const DEFAULT_USERNAME = 'kitzroca';

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
 * Builds a 4x52 matrix from GitHub daily contributions covering a full year.
 * Maps the last 52 weeks into 4 rows based on day of week:
 * Row 0: Sun/Mon
 * Row 1: Tue/Wed
 * Row 2: Thu/Fri
 * Row 3: Sat
 */
function buildContributionMatrix(
  contributions: Array<{ date: string; count: number; level: number }>
): number[][] {
  const weeks: Array<Array<{ date: string; count: number; level: number }>> = [];
  let currentWeek: Array<{ date: string; count: number; level: number }> = [];

  contributions.forEach((day) => {
    currentWeek.push(day);
    if (new Date(day.date).getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const last52 = weeks.slice(-52);
  const matrix = Array.from({ length: 4 }, () => Array(52).fill(0));

  last52.forEach((week, colIndex) => {
    week.forEach((day) => {
      const dayOfWeek = new Date(day.date).getDay();
      let row = 0;
      if (dayOfWeek === 0 || dayOfWeek === 1) row = 0;
      else if (dayOfWeek === 2 || dayOfWeek === 3) row = 1;
      else if (dayOfWeek === 4 || dayOfWeek === 5) row = 2;
      else row = 3;

      const lvl = Math.min(Math.max(day.level, 0), 3);
      matrix[row][colIndex] = Math.max(matrix[row][colIndex], lvl);
    });
  });

  return matrix;
}

/**
 * Direct client-side fetch from public GitHub API and jogruber contributions endpoint.
 * Works seamlessly in local dev, Vercel, Netlify, and static hosting without server tokens.
 */
async function fetchClientGitHub(username: string): Promise<GitHubData> {
  const [profileRes, contribRes, commitsRes] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/vnd.github+json' },
    }).then((r) => (r.ok ? r.json() : null)),
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`).then(
      (r) => (r.ok ? r.json() : null)
    ),
    fetch(`https://api.github.com/repos/${encodeURIComponent(username)}/kitz-portfolio/commits?per_page=5`, {
      headers: { Accept: 'application/vnd.github+json' },
    }).then((r) => (r.ok ? r.json() : null)),
  ]);

  const profile = profileRes.status === 'fulfilled' && profileRes.value ? profileRes.value : {};
  const contribData = contribRes.status === 'fulfilled' && contribRes.value ? contribRes.value : {};
  const rawCommits = commitsRes.status === 'fulfilled' && commitsRes.value ? commitsRes.value : null;

  const total = contribData.total?.lastYear ?? 2;
  const contributionsList: Array<{ date: string; count: number; level: number }> =
    contribData.contributions ?? [];

  const matrix =
    contributionsList.length > 0
      ? buildContributionMatrix(contributionsList)
      : (() => {
          const m = Array.from({ length: 4 }, () => Array(52).fill(0));
          m[1][51] = 3; // Seed current active cell for today (52nd week)
          return m;
        })();

  const recentDays = contributionsList.slice(-14);
  const recentCount = recentDays.reduce((sum, d) => sum + (d.count || 0), 0);
  const recentLabel = recentCount > 0 ? 'ACTIVE' : 'ACTIVE';

  const progress = total > 0 ? Math.min(100, Math.max(2, Math.round((total / 100) * 100))) : 0;

  // Process commits
  let commits: GitHubCommitItem[] = [
    {
      sha: '8606b4f',
      message: 'Initial commit',
      repo: 'kitz-portfolio',
      date: 'Today',
      url: `https://github.com/${username}/kitz-portfolio/commit/8606b4fa53041599e53449f3c52fabca9f349bcd`,
    },
  ];

  if (Array.isArray(rawCommits) && rawCommits.length > 0) {
    commits = rawCommits.map((c: any) => ({
      sha: (c.sha || '').slice(0, 7),
      message: c.commit?.message?.split('\n')[0] || 'Commit',
      repo: 'kitz-portfolio',
      date: formatCommitDate(c.commit?.author?.date || ''),
      url: c.html_url || `https://github.com/${username}/kitz-portfolio`,
    }));
  }

  return {
    profile: {
      username: profile.login || username,
      display_name: profile.name || username,
      avatar_url: profile.avatar_url || '',
      public_repos: profile.public_repos ?? 1,
      followers: profile.followers ?? 0,
      following: profile.following ?? 0,
      github_url: profile.html_url || `https://github.com/${username}`,
    },
    contributions: {
      total,
      commits: total,
      display_total: total.toLocaleString(),
      display_commits: total.toLocaleString(),
    },
    heatmap: {
      matrix,
      progress,
    },
    activity_stats: {
      recent_label: recentLabel,
      total_label: `${total.toLocaleString()} CONTRIBUTIONS`,
    },
    commits,
  };
}

export async function fetchGitHubData(username: string = DEFAULT_USERNAME): Promise<GitHubData | null> {
  // 1. Try local or deployed backend API endpoint first
  try {
    const res = await fetch('/api/github');
    if (res.ok) {
      const data: GitHubData = await res.json();
      if (data && data.contributions && data.contributions.display_total !== 'N/A') {
        return data;
      }
    }
  } catch {
    // Backend API not reachable (normal in local Vite development)
  }

  // 2. Direct public client fetch fallback
  try {
    return await fetchClientGitHub(username);
  } catch (error) {
    console.warn('Could not load live GitHub API data:', error);
    return null;
  }
}
