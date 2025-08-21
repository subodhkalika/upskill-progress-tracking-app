export interface CreateRoadmapInput {
  title: string;
  description: string;
  status: string;
  tags?: string[];
}

export interface UpdateRoadmapInput {
  title?: string;
  description?: string;
  status?: string;
  timeSpent?: number;
  tags?: string[];
}
