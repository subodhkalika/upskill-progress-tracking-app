import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateTaskInput, UpdateTaskInput } from '../interfaces/task';

const manageTags = async (prisma: any, tags: string[]) => {
  if (!tags) return undefined;
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

export const createTask = async (request: FastifyRequest<{ Body: CreateTaskInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { tags, ...taskData } = request.body;
  try {
    const newTags = await manageTags(request.server.prisma, tags ?? []);
    const newTask = await request.server.prisma.task.create({
      data: {
        ...taskData,
        userId,
        tags: newTags ? { connect: newTags } : undefined,
      }
    });
    return reply.status(201).send(newTask);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getAllTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const tasks = await request.server.prisma.task.findMany({
      where: { userId },
      orderBy: { dueDate: 'asc' },
      include: {
        skills: true,
        resources: true,
        tags: true,
      }
    });
    return reply.status(200).send(tasks);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getTaskById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const task = await request.server.prisma.task.findFirst({
      where: { id, userId },
      include: {
        skills: true,
        resources: true,
        timeLogs: true,
        tags: true,
      }
    });
    if (!task) {
      return reply.status(404).send({ message: 'Task not found.' });
    }
    return reply.status(200).send(task);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateTaskById = async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateTaskInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const { tags, ...updateData } = request.body;
  try {
    const task = await request.server.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return reply.status(404).send({ message: 'Task not found or you do not have permission to update it.' });
    }
    
    const newTags = await manageTags(request.server.prisma, tags ?? []);

    const updatedTask = await request.server.prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        tags: newTags ? { set: newTags } : undefined,
      },
      include: { tags: true }
    });
    return reply.status(200).send(updatedTask);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteTaskById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const task = await request.server.prisma.task.deleteMany({
      where: { id, userId }
    });
    if (task.count === 0) {
      return reply.status(404).send({ message: 'Task not found or you do not have permission to delete it.' });
    }
    return reply.status(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};
