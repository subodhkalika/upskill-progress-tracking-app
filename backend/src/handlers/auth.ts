import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginBody, RegisterBody } from '../interfaces/user';
import { comparePassword, hashPassword } from '../utils/password';

/**
 * Register new user
 */
export const registerUser = async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
  const { email, password } = request.body;
  try {
    const existingUser = await request.server.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(409).send({ message: 'User already exists.' });
    }

    const passwordHash = await hashPassword(password);
    
    const newUser = await request.server.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
        },
        select: { id: true, email: true, createdAt: true }
      });

      await prisma.progress.create({
        data: {
          userId: user.id,
        }
      });

      await prisma.settings.create({
        data: {
          userId: user.id,
        }
      });

      return user;
    });

    return reply.status(201).send({ message: 'User registered successfully.', user: newUser });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

/**
 * Login existing user
 */
export const loginUser = async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  const { email, password } = request.body;
  try {
    const user = await request.server.prisma.user.findUnique({ 
      where: { email },
      include: {
        progress: true,
        settings: true,
      }
    });
    if (!user) {
      return reply.status(401).send({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Invalid email or password.' });
    }

    const accessToken = request.server.jwt.sign({ userId: user.id, email: user.email }, { expiresIn: '15m' });
    const refreshToken = request.server.jwt.sign({ userId: user.id, email: user.email }, { expiresIn: '7d' });

    // Set refresh token as an HTTP-only cookie
    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
      path: '/refresh', // Only send the cookie to the /refresh endpoint
      sameSite: 'strict', // Protects against CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return reply.status(200).send({ message: 'Login successful.', accessToken, user: userWithoutPassword });
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

    const decodedToken = request.server.jwt.verify(refreshToken) as { userId: string, email: string };
    const accessToken = request.server.jwt.sign({ userId: decodedToken.userId, email: decodedToken.email }, { expiresIn: '15m' });
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
    reply.clearCookie('refreshToken', { path: '/refresh' });
  }

  return reply.status(200).send({ message: 'Logged out successfully.' });
};

/**
 * Get user profile
 */
export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user;
  return reply.status(200).send({ message: 'Profile retrieved.', user });
};