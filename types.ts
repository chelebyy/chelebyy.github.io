
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
  type: 'commit' | 'merge' | 'deploy' | 'alert';
  hash?: string;
  message: string;
}

