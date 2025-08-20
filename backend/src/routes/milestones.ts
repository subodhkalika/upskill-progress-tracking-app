import { FastifyInstance } from 'fastify';
import {
  getMilestones,
  getMilestone,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '../handlers/milestones';

const milestoneRoutes = async (server: FastifyInstance) => {
  server.get('/milestones', { preHandler: [server.authenticate] }, getMilestones);
  server.get('/milestones/:id', { preHandler: [server.authenticate] }, getMilestone);
  server.post('/milestones', { preHandler: [server.authenticate] }, createMilestone);
  server.put('/milestones/:id', { preHandler: [server.authenticate] }, updateMilestone);
  server.delete('/milestones/:id', { preHandler: [server.authenticate] }, deleteMilestone);
};

export default milestoneRoutes;
