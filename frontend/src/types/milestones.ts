import type { Task } from '.';

export const MilestoneStatus = {
  PLANNED: 'PLANNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  LOCKED: 'LOCKED',
} as const;

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: typeof MilestoneStatus[keyof typeof MilestoneStatus];
  completed: boolean;
  dueDate?: string;
  roadmapId: string;
  tasks: Task[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'VIDEO' | 'ARTICLE' | 'DOCUMENTATION' | 'OTHER';
  url?: string;
  duration?: number;
  completed: boolean;
  description?: string;
}