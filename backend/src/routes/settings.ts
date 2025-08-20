import { FastifyInstance } from 'fastify';
import { getSettings, updateSettings } from '../handlers/settings';

const settingsRoutes = async (server: FastifyInstance) => {
  server.get('/', { preHandler: [server.authenticate] }, getSettings);
  server.put('/', { preHandler: [server.authenticate] }, updateSettings);
};

export default settingsRoutes;
