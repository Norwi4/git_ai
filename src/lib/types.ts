export type Repository = {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  owner: {
    name: string;
    avatarUrl: string;
  };
};

export type FileNode = {
  type: 'file' | 'folder';
  name: string;
  commit: string;
  lastUpdated: string;
};

export type Commit = {
  hash: string;
  message: string;
  author: string;
  date: string;
  avatarUrl: string;
  filesChanged: { name: string; change: 'added' | 'modified' | 'deleted' }[];
};

export type Branch = {
  name: string;
  lastCommit: string;
  lastUpdated: string;
  isDefault?: boolean;
};

export type Issue = {
  id: number;
  title: string;
  state: 'open' | 'closed';
  author: string;
  labels: string[];
  createdAt: string;
  relevanceScore?: number;
  reason?: string;
};
