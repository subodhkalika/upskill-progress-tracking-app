import { ResourceType, ResourceStatus } from '@prisma/client';

export interface CreateResourceInput {
  title: string;
  description?: string;
  type: ResourceType;
  status?: ResourceStatus;
  duration?: number;
  rating?: number;
}

export interface UpdateResourceInput {
  title?: string;
  description?: string;
  type?: ResourceType;
  status?: ResourceStatus;
  duration?: number;
  rating?: number;
}