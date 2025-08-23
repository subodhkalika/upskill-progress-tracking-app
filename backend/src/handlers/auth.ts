import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginBody, SignupBody } from '../interfaces/user';
import { comparePassword, hashPassword } from '../utils/password';

/**
 * Signup new user
 */
export const signupUser = async (request: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
  const { email, password, name } = request.body;

  if (!email || !password || !name) {
    return reply.status(400).send({ message: 'Missing email, password, or name.' });
  }

  try {
    const existingUser = await request.server.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(409).send({ message: 'User with this email already exists.' });
    }

    const passwordHash = await hashPassword(password);

    const user = await request.server.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    return reply.status(201).send({ message: 'User created successfully.' });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

/**
 * Login existing user
 * NOTE: This function does not check for a password as the User model does not have one.
 * In a production environment, you should have a secure way of authenticating users.
 */
export const loginUser = async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.status(400).send({ message: 'Missing email or password.' });
  }

  try {
    const user = await request.server.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ message: 'Invalid email.' });
    }

    // Compare provided password with hashed password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Invalid credentials.' });
    }

    const accessToken = request.server.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '15m' });
    const refreshToken = request.server.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '7d' });

    // Set refresh token as an HTTP-only cookie
    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
      path: '/api/auth/refresh', // Only send the cookie to the /refresh endpoint
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
    reply.clearCookie('refreshToken', { path: '/api/auth/refresh' });
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