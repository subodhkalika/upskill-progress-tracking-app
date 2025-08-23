export const SubscriptionPlan = {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
} as const;

export const TaskStatus = {
  PENDING: 'PENDING' as const,
  IN_PROGRESS: 'IN_PROGRESS' as const,
  COMPLETED: 'COMPLETED' as const,
} as const;
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string | null;
  subscription: typeof SubscriptionPlan;
  passwordHash: string;
  createdAt: string;
}

export const ResourceType = {
  VIDEO: 'VIDEO',
  BOOK: 'BOOK',
  ARTICLE: 'ARTICLE',
  OTHER: 'OTHER',
} as const;
export type ResourceType = typeof ResourceType[keyof typeof ResourceType];

export const ResourceStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type ResourceStatus = typeof ResourceStatus[keyof typeof ResourceStatus];

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  status: typeof ResourceStatus[keyof typeof ResourceStatus];
  duration?: number;
  rating?: number;
  url?: string;
  tags?: { id: string; name: string }[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'planned';
  timeSpent: number;
  lastUpdated: string;
  milestones: any[]; // Replace with Milestone[] when defined
  skills: any[]; // Replace with Skill[] when defined
  createdAt: string;
  updatedAt: string;
  userId: string;
  // Frontend-specific properties, will be calculated
  progress?: number;
  totalMilestones?: number;
  completedMilestones?: number;
  tags?: string[];
}

export const TaskPriority = {
  LOW: 'LOW' as const,
  MEDIUM: 'MEDIUM' as const,
  HIGH: 'HIGH' as const,
} as const;
export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: typeof TaskStatus[keyof typeof TaskStatus];
  priority: typeof TaskPriority[keyof typeof TaskPriority];
  dueDate?: string;
  estimatedTime?: number;
  progress?: number;
  milestoneId?: string;
  userId: string;
  resources?: Resource[];
  createdAt: string;
  updatedAt: string;
  tags: { id: string; name: string }[];
  // Frontend-specific properties
  roadmap?: string; // This might need to be adjusted based on data source
}

export interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}
