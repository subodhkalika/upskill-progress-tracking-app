import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginBody } from '../interfaces/user';

/**
 * Login existing user
 * NOTE: This function does not check for a password as the User model does not have one.
 * In a production environment, you should have a secure way of authenticating users.
 */
export const loginUser = async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  const { email } = request.body;
  try {
    const user = await request.server.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ message: 'Invalid email.' });
    }

    const accessToken = request.server.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '15m' });
    const refreshToken = request.server.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '7d' });

    // Set refresh token as an HTTP-only cookie
    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
      path: '/auth/refresh', // Only send the cookie to the /refresh endpoint
      sameSite: 'strict', // Protects against CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return reply.status(200).send({ message: 'Login successful.', accessToken });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      return reply.status(401).send({ message: 'Refresh token not found.' });
    }

    const decodedToken = request.server.jwt.verify(refreshToken) as { id: string, email: string };
    const accessToken = request.server.jwt.sign({ id: decodedToken.id, email: decodedToken.email }, { expiresIn: '15m' });
    return reply.status(200).send({ accessToken });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

/**
 * Logout (noop for JWT)
 */
export const logoutUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const refreshToken = request.cookies.refreshToken as string;

  if (refreshToken) {
    reply.clearCookie('refreshToken', { path: '/auth/refresh' });
  }

  return reply.status(200).send({ message: 'Logged out successfully.' });
};

/**
 * Get user profile
 */
export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await request.server.prisma.user.findUnique({
    where: { id: request.user.id },
    include: {
      learningStats: true,
      achievements: true,
    }
  });
  return reply.status(200).send({ message: 'Profile retrieved.', user });
};