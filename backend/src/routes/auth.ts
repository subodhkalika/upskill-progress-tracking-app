import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { registerUser, logoutUser, getProfile, loginUser } from '../handlers/auth';
import { RegisterBody, LoginBody } from '../interfaces/user';
import { FastifyPluginAsync } from 'fastify';

/**
 * Authentication routes plugin for Fastify.
 * Defines endpoints for user registration, login, logout, and profile retrieval.
 */
const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  // Route for user registration
  fastify.post<{ Body: RegisterBody }>('/register', registerUser);

  // Route for user login
  fastify.post<{ Body: LoginBody }>('/login', loginUser);

  // Route for user logout
  fastify.post('/logout', logoutUser);

  // Protected route to get user profile
  // This route requires authentication.
  fastify.get('/profile', { onRequest: [fastify.authenticate] }, getProfile);
}

export default authRoutes;