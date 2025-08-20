import { User as PrismaUser } from '@prisma/client';

// A user object interface, excluding the password hash for public use
export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for a user with password hash (for internal use, e.g., login)
export interface UserWithPassword extends PrismaUser {}

// Request body for user registration
export interface RegisterBody {
  email: string;
  password: string;
}

// Request body for user login
export interface LoginBody {
  email: string;
  password: string;
}
