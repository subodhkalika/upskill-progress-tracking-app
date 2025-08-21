import { FastifyInstance } from 'fastify';
import * as learningStatsHandlers from '../handlers/learning-stats';
import { UpdateLearningStatsInput } from '../interfaces/learning-stats';

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    learningStatsHandlers.getLearningStats
  );

  fastify.put<{ Body: UpdateLearningStatsInput }>(
    '/', 
    { onRequest: [fastify.authenticate] }, 
    learningStatsHandlers.updateLearningStats
  );
}