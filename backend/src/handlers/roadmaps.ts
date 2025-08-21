import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateRoadmapInput, UpdateRoadmapInput } from '../interfaces/roadmap';

const manageTags = async (prisma: any, tags: string[]) => {
  const tagOperations = tags.map(tag => 
    prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    })
  );
  const createdOrFoundTags = await Promise.all(tagOperations);
  return createdOrFoundTags.map(tag => ({ id: tag.id }));
};

export const createRoadmap = async (request: FastifyRequest<{ Body: CreateRoadmapInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { title, description, status, tags } = request.body;
  try {
    const newRoadmap = await request.server.prisma.roadmap.create({
      data: {
        title,
        description,
        status,
        userId,
        tags: tags ? { connect: await manageTags(request.server.prisma, tags) } : undefined,
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
        tags: true,
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
        skills: true,
        tags: true,
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
  const { tags, ...updateData } = request.body;
  try {
    const roadmap = await request.server.prisma.roadmap.findFirst({
      where: { id, userId },
    });

    if (!roadmap) {
      return reply.status(404).send({ message: 'Roadmap not found or you do not have permission to update it.' });
    }

    const updatedRoadmap = await request.server.prisma.roadmap.update({
      where: { id },
      data: {
        ...updateData,
        lastUpdated: new Date(),
        tags: tags ? { set: await manageTags(request.server.prisma, tags) } : undefined,
      },
      include: { tags: true }
    });
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