export const SubscriptionPlan = {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
} as const;

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

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  estimatedTime?: number;
  progress?: number;
  milestoneId?: string;
  userId: string;
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
