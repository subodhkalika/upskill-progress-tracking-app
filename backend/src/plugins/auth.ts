import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
    };
  }
  
  interface FastifyInstance {
    auth: (handlers: any[]) => any[];
    jwtAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  // JWT authentication middleware
  fastify.decorate('jwtAuth', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return reply.status(401).send({ message: 'No token provided' });
      }

      const decoded = request.server.jwt.verify(token) as { email: string };
      const user = await request.server.prisma.user.findUnique({
        where: { email: decoded.email },
        select: { id: true, email: true }
      });

      if (!user) {
        return reply.status(401).send({ message: 'Invalid token' });
      }

      request.user = user;
    } catch (err) {
      return reply.status(401).send({ message: 'Invalid token' });
    }
  });

  // Auth decorator for backward compatibility
  fastify.decorate('auth', function (handlers: any[]) {
    return handlers;
  });
}

export default fp(authPlugin);
