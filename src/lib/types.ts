export type Repository = {
  id: number;
  name: string;
  path_with_namespace: string;
  web_url: string;
};

export type FileNode = {
  type: 'file' | 'folder';
  name: string;
  path: string;
  commit?: string;
  lastUpdated?: string;
  children?: FileNode[];
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
