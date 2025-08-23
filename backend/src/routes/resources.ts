import { FastifyInstance } from 'fastify';
import * as resourceHandlers from '../handlers/resources';
import { CreateResourceInput, UpdateResourceInput } from '../interfaces/resource';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: CreateResourceInput }>(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    resourceHandlers.createResource
  );
  
  fastify.get(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    resourceHandlers.getAllResources
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    resourceHandlers.getResourceById
  );

  fastify.put<{ Params: { id: string }, Body: UpdateResourceInput }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    resourceHandlers.updateResourceById
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    resourceHandlers.deleteResourceById
  );
}