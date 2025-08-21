import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateTaskInput, UpdateTaskInput } from '../interfaces/task';

export const createTask = async (request: FastifyRequest<{ Body: CreateTaskInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  try {
    const newTask = await request.server.prisma.task.create({
      data: {
        ...request.body,
        userId
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
        resources: true
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
        timeLogs: true
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
  const updateData = request.body;
  try {
    const task = await request.server.prisma.task.updateMany({
      where: { id, userId },
      data: updateData
    });
    if (task.count === 0) {
      return reply.status(404).send({ message: 'Task not found or you do not have permission to update it.' });
    }
    const updatedTask = await request.server.prisma.task.findUnique({ where: { id } });
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