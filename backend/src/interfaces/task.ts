import { TaskPriority } from '@prisma/client';

export interface CreateTaskInput {
  name: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedTime?: number;
  milestoneId?: string;
}

export interface UpdateTaskInput {
  name?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  estimatedTime?: number;
  progress?: number;
  milestoneId?: string;
}