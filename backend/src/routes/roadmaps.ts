import { FastifyInstance } from 'fastify';
import * as roadmapHandlers from '../handlers/roadmaps';
import { RoadmapInput } from '../interfaces/roadmap';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: RoadmapInput }>('/', { preHandler: [fastify.authenticate] }, roadmapHandlers.createRoadmap);
  fastify.get('/', { preHandler: [fastify.authenticate] }, roadmapHandlers.getRoadmaps);
  fastify.get<{ Params: { id: string } }>('/:id', { preHandler: [fastify.authenticate] }, roadmapHandlers.getRoadmap);
  fastify.put<{ Params: { id: string }, Body: Partial<RoadmapInput> }>('/:id', { preHandler: [fastify.authenticate] }, roadmapHandlers.updateRoadmap);
  fastify.delete<{ Params: { id: string } }>('/:id', { preHandler: [fastify.authenticate] }, roadmapHandlers.deleteRoadmap);
}
