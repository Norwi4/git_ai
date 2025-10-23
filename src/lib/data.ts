import type { Repository, FileNode, Commit, Branch, Issue } from './types';

export const repositories: Repository[] = [
  {
    id: 'gitlab-navigator',
    name: 'gitlab-navigator',
    description: 'The very application you are using now. A custom UI for GitLab.',
    language: 'TypeScript',
    stars: 123,
    forks: 45,
    lastUpdated: '3 hours ago',
    owner: { name: 'user', avatarUrl: 'https://picsum.photos/seed/user/40/40' },
  },
  {
    id: 'awesome-project',
    name: 'awesome-project',
    description: 'A revolutionary new framework for building web applications.',
    language: 'Rust',
    stars: 5432,
    forks: 987,
    lastUpdated: '1 day ago',
    owner: { name: 'user', avatarUrl: 'https://picsum.photos/seed/user/40/40' },
  },
  {
    id: 'dotfiles',
    name: 'dotfiles',
    description: 'My personal configuration files for various tools.',
    language: 'Shell',
    stars: 5,
    forks: 1,
    lastUpdated: '5 days ago',
    owner: { name: 'user', avatarUrl: 'https://picsum.photos/seed/user/40/40' },
  },
];

export const files: FileNode[] = [
  { type: 'folder', name: 'src', commit: 'feat: add main layout', lastUpdated: '2 hours ago' },
  { type: 'folder', name: 'public', commit: 'Initial commit', lastUpdated: '1 week ago' },
  { type: 'file', name: 'package.json', commit: 'chore: update dependencies', lastUpdated: '1 hour ago' },
  { type: 'file', name: 'README.md', commit: 'docs: update project description', lastUpdated: '4 hours ago' },
  { type: 'file', name: 'next.config.ts', commit: 'feat: enable turbopack', lastUpdated: '6 hours ago' },
];

export const commits: Commit[] = [
  { hash: 'e83a45c', message: 'feat: add main layout and sidebar', author: 'User', date: '2 hours ago', avatarUrl: 'https://picsum.photos/seed/user/40/40', filesChanged: [] },
  { hash: 'a1b2c3d', message: 'chore: update dependencies', author: 'User', date: '1 hour ago', avatarUrl: 'https://picsum.photos/seed/user/40/40', filesChanged: [] },
  { hash: 'f9e8d7c', message: 'docs: update project description', author: 'User', date: '4 hours ago', avatarUrl: 'https://picsum.photos/seed/user/40/40', filesChanged: [] },
  { hash: 'b4a5c6d', message: 'fix: correct typo in README', author: 'Another User', date: '1 day ago', avatarUrl: 'https://picsum.photos/seed/user2/40/40', filesChanged: [] },
  { hash: 'c3d4e5f', message: 'Initial commit', author: 'User', date: '1 week ago', avatarUrl: 'https://picsum.photos/seed/user/40/40', filesChanged: [] },
];

export const branches: Branch[] = [
  { name: 'main', lastCommit: 'e83a45c', lastUpdated: '2 hours ago', isDefault: true },
  { name: 'develop', lastCommit: 'a1b2c3d', lastUpdated: '1 hour ago' },
  { name: 'feature/new-ui', lastCommit: 'f9e8d7c', lastUpdated: '4 hours ago' },
  { name: 'fix/login-bug', lastCommit: 'b4a5c6d', lastUpdated: '1 day ago' },
];

export const issues: Issue[] = [
  { id: 42, title: 'UI glitch on mobile view', state: 'open', author: 'User', labels: ['bug', 'ui', 'mobile'], createdAt: '2 days ago' },
  { id: 41, title: 'Implement dark mode', state: 'open', author: 'Another User', labels: ['feature', 'ui'], createdAt: '5 days ago' },
  { id: 38, title: 'Refactor authentication logic', state: 'open', author: 'User', labels: ['refactor', 'backend'], createdAt: '1 week ago' },
  { id: 35, title: 'Update documentation for API endpoints', state: 'closed', author: 'Another User', labels: ['documentation'], createdAt: '2 weeks ago' },
  { id: 21, title: 'Add integration tests for payment flow', state: 'open', author: 'User', labels: ['testing', 'critical'], createdAt: '3 weeks ago' },
  { id: 15, title: 'Improve database query performance', state: 'open', author: 'Another User', labels: ['performance', 'database'], createdAt: '1 month ago' },
];
