import { FastifyInstance } from 'fastify';
import * as milestoneHandlers from '../handlers/milestones';
import { CreateMilestoneInput, UpdateMilestoneInput } from '../interfaces/milestone';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: CreateMilestoneInput }>(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    milestoneHandlers.createMilestone
  );

  fastify.get<{ Querystring: { roadmapId?: string } }>(
    '/',
    { onRequest: [fastify.authenticate] },
    milestoneHandlers.getAllMilestones
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    milestoneHandlers.getMilestoneById
  );

  fastify.put<{ Params: { id: string }, Body: UpdateMilestoneInput }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    milestoneHandlers.updateMilestoneById
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    milestoneHandlers.deleteMilestoneById
  );
}