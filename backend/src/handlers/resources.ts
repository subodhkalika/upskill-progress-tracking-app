import { FastifyRequest, FastifyReply } from 'fastify';
import { ResourceInput } from '../interfaces/resource';

export const createResource = async (request: FastifyRequest<{ Body: ResourceInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { title, url, type, notes, roadmapId } = request.body;
  try {
    const newResource = await request.server.prisma.resource.create({
      data: {
        title,
        url,
        type,
        notes,
        roadmapId,
        userId
      }
    });
    return reply.status(201).send({ message: 'Resource created successfully.', resource: newResource });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getResources = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const resources = await request.server.prisma.resource.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return reply.status(200).send({ resources });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getResource = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const resource = await request.server.prisma.resource.findFirst({
      where: { id, userId }
    });
    if (!resource) {
      return reply.status(404).send({ message: 'Resource not found.' });
    }
    return reply.status(200).send({ resource });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateResource = async (request: FastifyRequest<{ Params: { id: string }, Body: Partial<ResourceInput> }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const updateData = request.body;
  try {
    const resource = await request.server.prisma.resource.updateMany({
      where: { id, userId },
      data: updateData
    });
    if (resource.count === 0) {
      return reply.status(404).send({ message: 'Resource not found.' });
    }
    return reply.status(200).send({ message: 'Resource updated successfully.' });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteResource = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const resource = await request.server.prisma.resource.deleteMany({
      where: { id, userId }
    });
    if (resource.count === 0) {
      return reply.status(404).send({ message: 'Resource not found.' });
    }
    return reply.status(200).send({ message: 'Resource deleted successfully.' });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};
