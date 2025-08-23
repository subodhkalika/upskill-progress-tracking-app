import { TaskPriority, TaskStatus } from '@prisma/client';

export interface CreateTaskInput {
  name: string;
  description?: string;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  estimatedTime?: number;
  milestoneId?: string;
  tags?: string[];
}

export interface UpdateTaskInput {
  name?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  estimatedTime?: number;
  progress?: number;
  milestoneId?: string;
  tags?: string[];
}
