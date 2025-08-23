import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { logoutUser, getProfile, loginUser, refreshAccessToken, signupUser } from '../handlers/auth';
import { LoginBody, SignupBody } from '../interfaces/user';
import { FastifyPluginAsync } from 'fastify';

/**
 * Authentication routes plugin for Fastify.
 * Defines endpoints for user login, logout, token refresh and profile retrieval.
 */
const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  // Route for user signup
  fastify.post<{ Body: SignupBody }>('/signup', signupUser);

  // Route for user login
  fastify.post<{ Body: LoginBody }>('/login', loginUser);

  // Route to refresh access token
  fastify.post('/refresh', refreshAccessToken);

  // Route for user logout
  fastify.post('/logout', { onRequest: [fastify.authenticate] }, logoutUser);

  // Protected route to get user profile
  // This route requires authentication.
  fastify.get('/profile', { onRequest: [fastify.authenticate] }, getProfile);
}

export default authRoutes;