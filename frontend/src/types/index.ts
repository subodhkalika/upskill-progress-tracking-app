export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export const ResourceType = {
  VIDEO: 'VIDEO',
  BOOK: 'BOOK',
  ARTICLE: 'ARTICLE',
  COURSE: 'COURSE',
  OTHER: 'OTHER',
} as const;

export type ResourceType = typeof ResourceType[keyof typeof ResourceType];

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  completed: boolean;
  notes?: string;
  roadmapId?: string;
  userId: string;
  createdAt: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  resourceId?: string;
  createdAt: string;
}

export interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}
