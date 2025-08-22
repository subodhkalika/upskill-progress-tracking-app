import { RoadmapStatus } from '@prisma/client';
export interface CreateRoadmapInput {
  title: string;
  description: string;
  status: RoadmapStatus;
  tags?: string[];
}

export interface UpdateRoadmapInput {
  title?: string;
  description?: string;
  status?: RoadmapStatus;
  timeSpent?: number;
  tags?: string[];
}
