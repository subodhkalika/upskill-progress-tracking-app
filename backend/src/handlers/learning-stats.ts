import { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateLearningStatsInput } from '../interfaces/learning-stats';
import { isPrismaErrorCode } from '../utils/error';

export const getLearningStats = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    let learningStats = await request.server.prisma.learningStats.findUnique({
      where: { userId }
    });

    // If stats don't exist, create them
    if (!learningStats) {
      learningStats = await request.server.prisma.learningStats.create({
        data: { userId }
      });
    }

    return reply.status(200).send(learningStats);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateLearningStats = async (request: FastifyRequest<{ Body: UpdateLearningStatsInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const updateData = request.body;
  try {
    const updatedStats = await request.server.prisma.learningStats.update({
      where: { userId },
      data: updateData
    });
    return reply.status(200).send(updatedStats);
  } catch (err) {
    request.log.error(err);
    // If stats don't exist for the user, P2025 is the error code for record not found
    if (isPrismaErrorCode(err, 'P2025')) {
        return reply.status(404).send({ message: 'Learning stats not found for this user.' });
    }
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};