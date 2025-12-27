
export type Language = 'en' | 'tr';

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  stars: string;
  order: string;
  url?: string;
}

export interface ActivityLog {
  timestamp: string;
  type: 'commit' | 'merge' | 'deploy' | 'alert' | 'release';
  hash?: string;
  message: string;
  url?: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
}

export interface GitHubEvent {
  type: string;
  actor: {
    login: string;
  };
  repo: {
    name: string;
  };
  payload: {
    ref_type?: string;
    ref?: string;
    release?: {
      tag_name: string;
      name: string;
      html_url: string;
    };
  };
  created_at: string;
}
