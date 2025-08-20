import { FastifyRequest, FastifyReply } from 'fastify';
import { Progress } from '@prisma/client';

export const getProgress = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = request.user as { userId: string };
  const progress = await request.server.prisma.progress.findUnique({
    where: { userId },
  });
  reply.send(progress);
};

export const updateProgress = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = request.user as { userId: string };
  const { streaks, points } = request.body as Progress;
  const updatedProgress = await request.server.prisma.progress.update({
    where: { userId },
    data: {
      streaks,
      points,
    },
  });
  reply.send(updatedProgress);
};
