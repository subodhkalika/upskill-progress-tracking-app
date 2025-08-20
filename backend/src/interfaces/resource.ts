import { ResourceType } from '@prisma/client';

export interface ResourceInput {
  title: string;
  url: string;
  type: ResourceType;
  notes?: string;
  roadmapId?: string;
}
