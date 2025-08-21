import { FastifyInstance } from 'fastify';
import * as timeLogHandlers from '../handlers/timelogs';
import { CreateTimeLogInput, UpdateTimeLogInput } from '../interfaces/timelog';

export default async function (fastify: FastifyInstance) {
  // Create a timelog (nested under a task conceptually, but a top-level route for simplicity)
  fastify.post<{ Body: CreateTimeLogInput }>(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    timeLogHandlers.createTimeLog
  );
  
  // Get all timelogs for a specific task
  fastify.get<{ Params: { taskId: string } }>(
    '/task/:taskId', 
    { onRequest: [fastify.authenticate] }, 
    timeLogHandlers.getTimeLogsForTask
  );

  fastify.put<{ Params: { id: string }, Body: UpdateTimeLogInput }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    timeLogHandlers.updateTimeLogById
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    timeLogHandlers.deleteTimeLogById
  );
}