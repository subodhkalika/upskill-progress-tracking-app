import { FastifyRequest, FastifyReply } from 'fastify';
import { RoadmapInput } from '../interfaces/roadmap';

export const createRoadmap = async (request: FastifyRequest<{ Body: RoadmapInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { title, description, isPublic } = request.body;
  try {
    const newRoadmap = await request.server.prisma.roadmap.create({
      data: {
        title,
        description,
        isPublic: isPublic ?? false,
        userId
      }
    });
    return reply.status(201).send({ message: 'Roadmap created successfully.', roadmap: newRoadmap });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getRoadmaps = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const roadmaps = await request.server.prisma.roadmap.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return reply.status(200).send({ roadmaps });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getRoadmap = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const roadmap = await request.server.prisma.roadmap.findFirst({
      where: { id, userId }
    });
    if (!roadmap) {
      return reply.status(404).send({ message: 'Roadmap not found.' });
    }
    return reply.status(200).send({ roadmap });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateRoadmap = async (request: FastifyRequest<{ Params: { id: string }, Body: Partial<RoadmapInput> }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const updateData = request.body;
  try {
    const roadmap = await request.server.prisma.roadmap.updateMany({
      where: { id, userId },
      data: updateData
    });
    if (roadmap.count === 0) {
      return reply.status(404).send({ message: 'Roadmap not found.' });
    }
    return reply.status(200).send({ message: 'Roadmap updated successfully.' });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteRoadmap = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const roadmap = await request.server.prisma.roadmap.deleteMany({
      where: { id, userId }
    });
    if (roadmap.count === 0) {
      return reply.status(404).send({ message: 'Roadmap not found.' });
    }
    return reply.status(200).send({ message: 'Roadmap deleted successfully.' });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};
