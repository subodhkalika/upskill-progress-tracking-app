import { FastifyInstance } from 'fastify';
import * as roadmapHandlers from '../handlers/roadmaps';

export default async function (fastify: FastifyInstance) {
  fastify.post('/', { preHandler: fastify.auth([fastify.jwtAuth]) }, roadmapHandlers.createRoadmap);
  fastify.get('/', { preHandler: fastify.auth([fastify.jwtAuth]) }, roadmapHandlers.getRoadmaps);
  fastify.get('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, roadmapHandlers.getRoadmap);
  fastify.put('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, roadmapHandlers.updateRoadmap);
  fastify.delete('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, roadmapHandlers.deleteRoadmap);
}
