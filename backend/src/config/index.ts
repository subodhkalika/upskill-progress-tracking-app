import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/my_db1',
  sessionSecret: process.env.SESSION_SECRET || 'super_secret_default_key',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_default_key',
};
