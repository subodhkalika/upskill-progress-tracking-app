import { FastifyInstance } from 'fastify';
import * as achievementHandlers from '../handlers/achievements';
import { CreateAchievementInput, UpdateAchievementInput } from '../interfaces/achievement';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: CreateAchievementInput }>(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    achievementHandlers.createAchievement
  );
  
  fastify.get(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    achievementHandlers.getAllAchievements
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    achievementHandlers.getAchievementById
  );

  fastify.put<{ Params: { id: string }, Body: UpdateAchievementInput }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    achievementHandlers.updateAchievementById
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id', 
    { onRequest: [fastify.authenticate] }, 
    achievementHandlers.deleteAchievementById
  );
}