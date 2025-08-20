import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskInput } from '../interfaces/task';

export const createTask = async (request: FastifyRequest<{ Body: TaskInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { title, resourceId } = request.body;
  try {
    const newTask = await request.server.prisma.task.create({
      data: {
        title,
        resourceId,
        userId
      }
    });
    return reply.status(201).send({ message: 'Task created successfully.', task: newTask });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const tasks = await request.server.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return reply.status(200).send({ tasks });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getTask = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const task = await request.server.prisma.task.findFirst({
      where: { id, userId }
    });
    if (!task) {
      return reply.status(404).send({ message: 'Task not found.' });
    }
    return reply.status(200).send({ task });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateTask = async (request: FastifyRequest<{ Params: { id: string }, Body: Partial<TaskInput> }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const updateData = request.body;
  try {
    const task = await request.server.prisma.task.updateMany({
      where: { id, userId },
      data: updateData
    });
    if (task.count === 0) {
      return reply.status(404).send({ message: 'Task not found.' });
    }
    return reply.status(200).send({ message: 'Task updated successfully.' });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteTask = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const task = await request.server.prisma.task.deleteMany({
      where: { id, userId }
    });
    if (task.count === 0) {
      return reply.status(404).send({ message: 'Task not found.' });
    }
    return reply.status(200).send({ message: 'Task deleted successfully.' });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};
