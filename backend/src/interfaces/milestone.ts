import { MilestoneStatus } from '@prisma/client';

export interface CreateMilestoneInput {
  title: string;
  description?: string;
  status: MilestoneStatus;
  dueDate?: Date;
  roadmapId: string;
}

export interface UpdateMilestoneInput {
  title?: string;
  description?: string;
  status?: MilestoneStatus;
  dueDate?: Date;
  completed?: boolean;
}