
export interface CreateTimeLogInput {
  duration: number;
  note?: string;
  taskId: string;
}

export interface UpdateTimeLogInput {
  duration?: number;
  note?: string;
}