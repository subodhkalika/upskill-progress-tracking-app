import { FastifyInstance } from 'fastify';
import * as taskHandlers from '../handlers/tasks';

export default async function (fastify: FastifyInstance) {
  fastify.post('/', { preHandler: fastify.auth([fastify.jwtAuth]) }, taskHandlers.createTask);
  fastify.get('/', { preHandler: fastify.auth([fastify.jwtAuth]) }, taskHandlers.getTasks);
  fastify.get('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, taskHandlers.getTask);
  fastify.put('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, taskHandlers.updateTask);
  fastify.delete('/:id', { preHandler: fastify.auth([fastify.jwtAuth]) }, taskHandlers.deleteTask);
}
