import { User as PrismaUser, SubscriptionPlan } from '@prisma/client';

// Public user data
export interface User extends Omit<PrismaUser, 'email'> {
  id: string;
  name: string;
  profilePicture?: string | null;
  subscription: SubscriptionPlan;
  createdAt: Date;
  updatedAt: Date;
}

// For creating a new user
export interface CreateUserInput {
  email: string;
  name: string;
  profilePicture?: string;
}

// For updating an existing user
export interface UpdateUserInput {
  name?: string;
  profilePicture?: string;
  subscription?: SubscriptionPlan;
}


// For login
export interface LoginBody {
  email: string;
  password: string;
}

// For signup
export interface SignupBody {
  email: string;
  password: string;
  name: string;
}
