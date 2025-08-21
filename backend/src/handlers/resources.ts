import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateResourceInput, UpdateResourceInput } from '../interfaces/resource';

export const createResource = async (request: FastifyRequest<{ Body: CreateResourceInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const newResource = await request.server.prisma.resource.create({
      data: {
        ...request.body,
        userId
      }
    });
    return reply.status(201).send(newResource);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getAllResources = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const resources = await request.server.prisma.resource.findMany({
      where: { userId },
      orderBy: { addedOn: 'desc' },
      include: {
        skills: true,
        categories: true
      }
    });
    return reply.status(200).send(resources);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getResourceById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const resource = await request.server.prisma.resource.findFirst({
      where: { id, userId },
      include: {
        skills: true,
        categories: true,
        tasks: true
      }
    });
    if (!resource) {
      return reply.status(404).send({ message: 'Resource not found.' });
    }
    return reply.status(200).send(resource);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateResourceById = async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateResourceInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const updateData = request.body;
  try {
    const resource = await request.server.prisma.resource.updateMany({
      where: { id, userId },
      data: updateData
    });
    if (resource.count === 0) {
      return reply.status(404).send({ message: 'Resource not found or you do not have permission to update it.' });
    }
    const updatedResource = await request.server.prisma.resource.findUnique({ where: { id } });
    return reply.status(200).send(updatedResource);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteResourceById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const resource = await request.server.prisma.resource.deleteMany({
      where: { id, userId }
    });
    if (resource.count === 0) {
      return reply.status(404).send({ message: 'Resource not found or you do not have permission to delete it.' });
    }
    return reply.status(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};