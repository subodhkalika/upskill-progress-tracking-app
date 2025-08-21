import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from './config';
import dbPlugin from './plugins/db';
import authPlugin from './plugins/auth';
import authRoutes from './routes/auth';
import resourceRoutes from './routes/resources';
import roadmapRoutes from './routes/roadmaps';
import taskRoutes from './routes/tasks';
import milestoneRoutes from './routes/milestones';
import skillRoutes from './routes/skills';
import timeLogRoutes from './routes/timelogs';
import achievementRoutes from './routes/achievements';
import learningStatsRoutes from './routes/learning-stats';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
    };
  }
}

const app: FastifyInstance = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
      },
    },
  },
});

const loadJwtConfig = () => {
  return {
    secret: config.jwtSecret,
    sign: {
      expiresIn: '15m', // Access token expires in 15 minutes
    },
    cookie: {
      cookieName: 'refreshToken', // Name of the cookie for refresh token
      signed: false, // Set to true if you want to sign the cookie
    },
    messages: {
      badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
      noAuthorizationInHeaderMessage: 'Authorization header is missing!',
      authorizationTokenExpiredMessage: 'Authorization token expired',
      authorizationTokenInvalidMessage: 'Authorization token is invalid!',
      authorizationTokenUntrustedMessage: 'Authorization token is untrusted!',
    },
  }
}

const loadDecorators = async () => {
  // Hook to verify JWT for protected routes
  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const decoded = await request.jwtVerify() as { id: string, email: string };
      request.user = decoded;
    } catch (err) {
      reply.send(err);
    }
  });
}

const loadRoutes = async () => {
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(roadmapRoutes, { prefix: '/api/roadmaps' });
  await app.register(milestoneRoutes, { prefix: '/api/milestones' });
  await app.register(taskRoutes, { prefix: '/api/tasks' });
  await app.register(resourceRoutes, { prefix: '/api/resources' });
  await app.register(skillRoutes, { prefix: '/api/skills' });
  await app.register(timeLogRoutes, { prefix: '/api/timelogs' });
  await app.register(achievementRoutes, { prefix: '/api/achievements' });
  await app.register(learningStatsRoutes, { prefix: '/api/learning-stats' });
  
  app.log.info('All routes registered.');

  // Root route
  app.get('/api', async (request: FastifyRequest,  reply: FastifyReply) => {
    reply.send({ message: 'Fastify API is running!' });
  }); 
}

async function bootstrap() {
  try {
    await app.register(cors, {
      origin: 'http://localhost:3001', // Or set to your frontend URL like "http://localhost:3000"
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    });
    
    // Register DB plugin first
    await app.register(dbPlugin);
    app.log.info('Prisma DB plugin registered.');
    
    app.register(cookie);
    app.register(jwt, loadJwtConfig());
    app.log.info('JWT plugin registered.');

    // Register auth plugin
    await app.register(authPlugin);
    app.log.info('Auth plugin registered.');

    await loadDecorators();
    app.log.info('Auth decorators loaded.');

    await loadRoutes();

    // Start server
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${config.port}`);

  } catch (err) {
    app.log.error(err, 'Application failed to start:');
    process.exit(1);
  }
}

bootstrap();