import { FastifyInstance } from 'fastify';
import * as skillHandlers from '../handlers/skills';
import { CreateSkillInput, UpdateSkillInput } from '../interfaces/skill';

export default async function (fastify: FastifyInstance) {
  // Skills are public, so some routes may not require authentication
  fastify.post<{ Body: CreateSkillInput }>(
    '/', 
    { onRequest: [fastify.authenticate] }, // Or remove auth if skills can be created publicly
    skillHandlers.createSkill
  );
  
  fastify.get(
    '/', 
    skillHandlers.getAllSkills
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id', 
    skillHandlers.getSkillById
  );

  fastify.put<{ Params: { id: string }, Body: UpdateSkillInput }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    skillHandlers.updateSkillById
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    skillHandlers.deleteSkillById
  );
}