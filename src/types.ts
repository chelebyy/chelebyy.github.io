export type Language = 'en' | 'tr';

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  url: string;
  homepage: string | null;
  pushedAt: string;
  archived: boolean;
  fork: boolean;
  license: string | null;
  /** Missing in data cached before this field existed. */
  defaultBranch?: string | null;
}

export type ActivityType = 'release' | 'tag' | 'push' | 'create' | 'merge';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  repo: string;
  ref?: string;
  message: string;
  url: string;
  /** Number of pushes folded into this line (same repo, branch and day). */
  count?: number;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
  license: { spdx_id: string | null } | null;
  default_branch?: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  payload: {
    ref_type?: string;
    ref?: string | null;
    size?: number;
    action?: string;
    number?: number;
    release?: {
      tag_name: string;
      name: string | null;
      html_url: string;
    };
  };
  created_at: string;
}
