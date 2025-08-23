import { FastifyInstance } from 'fastify';
import * as taskHandlers from '../handlers/tasks';
import { CreateTaskInput, UpdateTaskInput } from '../interfaces/task';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: CreateTaskInput }>(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    taskHandlers.createTask
  );
  
  fastify.get(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    taskHandlers.getAllTasks
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    taskHandlers.getTaskById
  );

  fastify.put<{ Params: { id: string }, Body: UpdateTaskInput }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    taskHandlers.updateTaskById
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    taskHandlers.deleteTaskById
  );
}