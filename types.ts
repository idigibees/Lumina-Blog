export enum UserRole {
  ADMIN = 'ADMIN',
  AUTHOR = 'AUTHOR',
  READER = 'READER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  earnings: number; // Simulated ad revenue
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML
  coverImage: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  views: number;
  likes: number;
  tags: string[];
  published: boolean;
  comments: Comment[];
}

export interface AdStats {
  impressions: number;
  clicks: number;
  revenue: number;
}