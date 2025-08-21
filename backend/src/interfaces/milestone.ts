
export interface CreateMilestoneInput {
  title: string;
  description?: string;
  dueDate?: Date;
  roadmapId: string;
}

export interface UpdateMilestoneInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
}