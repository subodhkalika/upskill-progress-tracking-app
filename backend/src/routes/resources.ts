import { FastifyInstance } from 'fastify';
import * as resourceHandlers from '../handlers/resources';
import { ResourceInput } from '../interfaces/resource';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: ResourceInput }>('/', { preHandler: [fastify.authenticate] }, resourceHandlers.createResource);
  fastify.get('/', { preHandler: [fastify.authenticate] }, resourceHandlers.getResources);
  fastify.get<{ Params: { id: string } }>('/:id', { preHandler: [fastify.authenticate] }, resourceHandlers.getResource);
  fastify.put<{ Params: { id: string }, Body: Partial<ResourceInput> }>('/:id', { preHandler: [fastify.authenticate] }, resourceHandlers.updateResource);
  fastify.delete<{ Params: { id: string } }>('/:id', { preHandler: [fastify.authenticate] }, resourceHandlers.deleteResource);
}
