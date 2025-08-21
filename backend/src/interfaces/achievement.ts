
export interface CreateAchievementInput {
  title: string;
  description: string;
  icon?: string;
}

export interface UpdateAchievementInput {
  title?: string;
  description?: string;
  icon?: string;
}