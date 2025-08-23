import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateAchievementInput, UpdateAchievementInput } from '../interfaces/achievement';

export const createAchievement = async (request: FastifyRequest<{ Body: CreateAchievementInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const newAchievement = await request.server.prisma.achievement.create({
      data: {
        ...request.body,
        userId
      }
    });
    return reply.status(201).send(newAchievement);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getAllAchievements = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const achievements = await request.server.prisma.achievement.findMany({
      where: { userId },
      orderBy: { earnedOn: 'desc' }
    });
    return reply.status(200).send(achievements);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getAchievementById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const achievement = await request.server.prisma.achievement.findFirst({
      where: { id, userId }
    });
    if (!achievement) {
      return reply.status(404).send({ message: 'Achievement not found.' });
    }
    return reply.status(200).send(achievement);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateAchievementById = async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateAchievementInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const updateData = request.body;
  try {
    const achievement = await request.server.prisma.achievement.updateMany({
      where: { id, userId },
      data: updateData
    });
    if (achievement.count === 0) {
      return reply.status(404).send({ message: 'Achievement not found or you do not have permission to update it.' });
    }
    const updatedAchievement = await request.server.prisma.achievement.findUnique({ where: { id } });
    return reply.status(200).send(updatedAchievement);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteAchievementById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const achievement = await request.server.prisma.achievement.deleteMany({
      where: { id, userId }
    });
    if (achievement.count === 0) {
      return reply.status(404).send({ message: 'Achievement not found or you do not have permission to delete it.' });
    }
    return reply.status(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};