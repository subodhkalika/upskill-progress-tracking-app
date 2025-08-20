import { FastifyRequest, FastifyReply } from 'fastify';
import { Settings } from '@prisma/client';

export const getSettings = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = request.user as { userId: string };
  const settings = await request.server.prisma.settings.findUnique({
    where: { userId },
  });
  reply.send(settings);
};

export const updateSettings = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = request.user as { userId: string };
  const { notificationsEnabled, theme } = request.body as Settings;
  const updatedSettings = await request.server.prisma.settings.update({
    where: { userId },
    data: {
      notificationsEnabled,
      theme,
    },
  });
  reply.send(updatedSettings);
};
