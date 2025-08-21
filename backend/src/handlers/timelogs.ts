import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateTimeLogInput, UpdateTimeLogInput } from '../interfaces/timelog';

export const createTimeLog = async (request: FastifyRequest<{ Body: CreateTimeLogInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { duration, note, taskId } = request.body;

  try {
    // Verify the task belongs to the user
    const task = await request.server.prisma.task.findFirst({
      where: { id: taskId, userId }
    });

    if (!task) {
      return reply.status(404).send({ message: 'Task not found or you do not have permission to add a time log to it.' });
    }

    const newTimeLog = await request.server.prisma.timeLog.create({
      data: {
        duration,
        note,
        taskId
      }
    });
    return reply.status(201).send(newTimeLog);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getTimeLogsForTask = async (request: FastifyRequest<{ Params: { taskId: string } }>, reply: FastifyReply) => {
    const userId = request.user.id;
    const { taskId } = request.params;
    try {
        const task = await request.server.prisma.task.findFirst({
            where: { id: taskId, userId }
        });

        if (!task) {
            return reply.status(404).send({ message: 'Task not found.' });
        }

        const timeLogs = await request.server.prisma.timeLog.findMany({
            where: { taskId },
            orderBy: { loggedAt: 'desc' }
        });
        return reply.status(200).send(timeLogs);
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};

export const updateTimeLogById = async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateTimeLogInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const updateData = request.body;
  try {
    const timelog = await request.server.prisma.timeLog.findFirst({
        where: {
            id,
            task: {
                userId
            }
        }
    });

    if (!timelog) {
        return reply.status(404).send({ message: 'Time log not found or you do not have permission to update it.' });
    }

    const updatedTimeLog = await request.server.prisma.timeLog.update({
      where: { id },
      data: updateData
    });

    return reply.status(200).send(updatedTimeLog);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteTimeLogById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const timelog = await request.server.prisma.timeLog.findFirst({
        where: {
            id,
            task: {
                userId
            }
        }
    });

    if (!timelog) {
        return reply.status(404).send({ message: 'Time log not found or you do not have permission to delete it.' });
    }

    await request.server.prisma.timeLog.delete({
      where: { id }
    });

    return reply.status(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};