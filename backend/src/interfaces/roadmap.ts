export interface CreateRoadmapInput {
  title: string;
  description: string;
  status: string;
}

export interface UpdateRoadmapInput {
  title?: string;
  description?: string;
  status?: string;
  timeSpent?: number;
}