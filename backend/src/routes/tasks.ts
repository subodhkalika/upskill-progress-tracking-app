import { FastifyInstance } from 'fastify';
import * as taskHandlers from '../handlers/tasks';
import { TaskInput } from '../interfaces/task';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: TaskInput }>('/', { preHandler: [fastify.authenticate] }, taskHandlers.createTask);
  fastify.get('/', { preHandler: [fastify.authenticate] }, taskHandlers.getTasks);
  fastify.get<{ Params: { id: string } }>('/:id', { preHandler: [fastify.authenticate] }, taskHandlers.getTask);
  fastify.put<{ Params: { id: string }, Body: Partial<TaskInput> }>('/:id', { preHandler: [fastify.authenticate] }, taskHandlers.updateTask);
  fastify.delete<{ Params: { id: string } }>('/:id', { preHandler: [fastify.authenticate] }, taskHandlers.deleteTask);
}
