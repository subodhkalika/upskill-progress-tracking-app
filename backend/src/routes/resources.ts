import { FastifyInstance } from 'fastify';
import * as resourceHandlers from '../handlers/resources';

export default async function (fastify: FastifyInstance) {
  fastify.post('/', { preHandler: fastify.auth([fastify.jwtAuth]) }, resourceHandlers.createResource);
  fastify.get('/', { preHandler: fastify.auth([fastify.jwtAuth]) }, resourceHandlers.getResources);
  fastify.get('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, resourceHandlers.getResource);
  fastify.put('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, resourceHandlers.updateResource);
  fastify.delete('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, resourceHandlers.deleteResource);
}
