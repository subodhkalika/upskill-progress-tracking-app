import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import prisma from '../database/prisma';

// Extend FastifyInstance to include the Prisma client
declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

/**
 * Fastify plugin to expose the Prisma client instance.
 * This makes `fastify.prisma` available throughout the application.
 */
async function dbPlugin(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.decorate('prisma', prisma);

  // Close Prisma client when the Fastify server closes
  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
}

export default fp(dbPlugin, {
  name: 'db-plugin',
});