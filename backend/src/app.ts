import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from './config';
import dbPlugin from './plugins/db';
import authPlugin from './plugins/auth';
import authRoutes from './routes/auth';
import resourceRoutes from './routes/resources'; // Import new routes
import roadmapRoutes from './routes/roadmaps'; // Import roadmap routes
import taskRoutes from './routes/tasks'; // Import task routes
import milestoneRoutes from './routes/milestones';
import progressRoutes from './routes/progress';
import settingsRoutes from './routes/settings';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
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
    decode: { complete: true },
    verify: {
      // This is used to verify the token.
      // We are adding userId to the payload.
      // So we need to tell jwt.verify to expect it.
      // Otherwise it will throw an error.
      allowedIss: ['localhost'],
      allowedAud: ['localhost'],
    }
  }
}

const loadRoutes = async () => {
  // Register auth routes
  await app.register(authRoutes, { prefix: '/auth' });
  app.log.info('Authentication routes registered.');

  // Register resources routes
  await app.register(resourceRoutes, { prefix: '/resources' }); // Register new routes
  app.log.info('Resources routes registered.');

  // Register roadmap routes
  await app.register(roadmapRoutes, { prefix: '/roadmaps' }); // Register roadmap routes
  app.log.info('Roadmap routes registered.');

  // Register task routes
  await app.register(taskRoutes, { prefix: '/tasks' }); // Register task routes
  app.log.info('Task routes registered.');

  // Register milestone routes
  await app.register(milestoneRoutes, { prefix: '/milestones' });
  app.log.info('Milestone routes registered.');

  // Register progress routes
  await app.register(progressRoutes, { prefix: '/progress' });
  app.log.info('Progress routes registered.');

  // Register settings routes
  await app.register(settingsRoutes, { prefix: '/settings' });
  app.log.info('Settings routes registered.');

  // Root route
  app.get('/', async (request: FastifyRequest,  reply: FastifyReply) => {
    reply.send({ message: 'Fastify API is running!' });
  }); 
}

async function bootstrap() {
  try {
    await app.register(cors, {
      origin: 'http://localhost:3001', // Or set to your frontend URL like "http://localhost:3001"
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

    await loadRoutes();
    app.log.info('Routes loaded.');

    // Start server
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${config.port}`);

  } catch (err) {
    app.log.error(err, 'Application failed to start:');
    process.exit(1);
  }
}

bootstrap();