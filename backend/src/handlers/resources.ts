import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateResourceInput, UpdateResourceInput } from '../interfaces/resource';

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

export const createResource = async (request: FastifyRequest<{ Body: CreateResourceInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { tags, ...resourceData } = request.body;
  try {
    const newResource = await request.server.prisma.resource.create({
      data: {
        ...resourceData,
        userId,
        tags: tags ? { connect: await manageTags(request.server.prisma, tags) } : undefined,
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
        categories: true,
        tags: true,
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
        tasks: true,
        tags: true,
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
  const { tags, ...updateData } = request.body;
  try {
    const resource = await request.server.prisma.resource.findFirst({
      where: { id, userId },
    });

    if (!resource) {
      return reply.status(404).send({ message: 'Resource not found or you do not have permission to update it.' });
    }

    const updatedResource = await request.server.prisma.resource.update({
      where: { id },
      data: {
        ...updateData,
        tags: tags ? { set: await manageTags(request.server.prisma, tags) } : undefined,
      },
      include: { tags: true }
    });
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