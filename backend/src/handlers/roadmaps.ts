import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateRoadmapInput, UpdateRoadmapInput } from '../interfaces/roadmap';

export const createRoadmap = async (request: FastifyRequest<{ Body: CreateRoadmapInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { title, description, status } = request.body;
  try {
    const newRoadmap = await request.server.prisma.roadmap.create({
      data: {
        title,
        description,
        status,
        userId
      }
    });
    return reply.status(201).send(newRoadmap);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getAllRoadmaps = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const roadmaps = await request.server.prisma.roadmap.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        skills: true,
        _count: {
          select: { milestones: true }
        }
      }
    });
    return reply.status(200).send(roadmaps);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getRoadmapById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const roadmap = await request.server.prisma.roadmap.findFirst({
      where: { id, userId },
      include: {
        milestones: {
          orderBy: { createdAt: 'asc' },
          include: {
            _count: {
              select: { tasks: true }
            }
          }
        },
        skills: true
      }
    });
    if (!roadmap) {
      return reply.status(404).send({ message: 'Roadmap not found.' });
    }
    return reply.status(200).send(roadmap);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateRoadmapById = async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateRoadmapInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const updateData = request.body;
  try {
    const roadmap = await request.server.prisma.roadmap.updateMany({
      where: { id, userId },
      data: {
        ...updateData,
        lastUpdated: new Date()
      }
    });
    if (roadmap.count === 0) {
      return reply.status(404).send({ message: 'Roadmap not found or you do not have permission to update it.' });
    }
    const updatedRoadmap = await request.server.prisma.roadmap.findUnique({ where: { id } });
    return reply.status(200).send(updatedRoadmap);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteRoadmapById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const roadmap = await request.server.prisma.roadmap.deleteMany({
      where: { id, userId }
    });
    if (roadmap.count === 0) {
      return reply.status(404).send({ message: 'Roadmap not found or you do not have permission to delete it.' });
    }
    return reply.status(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};