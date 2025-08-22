export interface Milestone {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  estimatedTime: string;
  timeSpent: string;
  status: 'completed' | 'active' | 'locked';
  dueDate?: string;
  roadmapId: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  estimatedTime: string;
  timeSpent: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  milestoneId: number;
  resources: Resource[];
}

export interface Resource {
  id: number;
  title: string;
  type: 'video' | 'article' | 'documentation' | 'exercise' | 'quiz';
  url?: string;
  duration?: string;
  completed: boolean;
  description?: string;
}
