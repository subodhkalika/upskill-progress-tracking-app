import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt hashing

/**
 * Hashes a plain-text password using bcrypt.
 * @param password The plain-text password to hash.
 * @returns A Promise that resolves to the hashed password string.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain-text password with a hashed password.
 * @param password The plain-text password.
 * @param hash The hashed password to compare against.
 * @returns A Promise that resolves to a boolean indicating if the passwords match.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
