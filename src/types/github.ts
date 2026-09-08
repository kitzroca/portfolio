export interface GitHubProfile {
  username: string;
  display_name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  github_url: string;
}

export interface GitHubContributions {
  total: number;
  commits: number;
  display_total: string;
  display_commits: string;
}

export interface GitHubHeatmap {
  matrix: number[][];
  progress: number;
}

export interface GitHubActivityStats {
  recent_label: string;
  total_label: string;
}

export interface GitHubCommitItem {
  sha: string;
  message: string;
  repo: string;
  date: string;
  url: string;
}

export interface GitHubData {
  profile: GitHubProfile;
  contributions: GitHubContributions;
  heatmap: GitHubHeatmap;
  activity_stats: GitHubActivityStats;
  commits?: GitHubCommitItem[];
}
