import { FastifyInstance } from 'fastify';
import { getProgress, updateProgress } from '../handlers/progress';

const progressRoutes = async (server: FastifyInstance) => {
  server.get('/', { preHandler: [server.authenticate] }, getProgress);
  server.put('/progress', { preHandler: [server.authenticate] }, updateProgress);
};

export default progressRoutes;
