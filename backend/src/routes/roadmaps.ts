import { FastifyInstance } from 'fastify';
import * as roadmapHandlers from '../handlers/roadmaps';
import { CreateRoadmapInput, UpdateRoadmapInput } from '../interfaces/roadmap';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: CreateRoadmapInput }>(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    roadmapHandlers.createRoadmap
  );
  
  fastify.get(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    roadmapHandlers.getAllRoadmaps
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    roadmapHandlers.getRoadmapById
  );

  fastify.put<{ Params: { id: string }, Body: UpdateRoadmapInput }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    roadmapHandlers.updateRoadmapById
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    roadmapHandlers.deleteRoadmapById
  );
}