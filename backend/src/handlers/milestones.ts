import { FastifyRequest, FastifyReply } from 'fastify';
import { Milestone } from '@prisma/client';

export const getMilestones = async (request: FastifyRequest, reply: FastifyReply) => {
  const { roadmapId } = request.query as { roadmapId: string };
  const milestones = await request.server.prisma.milestone.findMany({
    where: { roadmapId },
  });
  reply.send(milestones);
};

export const getMilestone = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const milestone = await request.server.prisma.milestone.findUnique({
    where: { id },
  });
  reply.send(milestone);
};

export const createMilestone = async (request: FastifyRequest, reply: FastifyReply) => {
  const { title, description, roadmapId } = request.body as Milestone;
  const newMilestone = await request.server.prisma.milestone.create({
    data: {
      title,
      description,
      roadmapId,
    },
  });
  reply.send(newMilestone);
};

export const updateMilestone = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { title, description, completed } = request.body as Milestone;
  const updatedMilestone = await request.server.prisma.milestone.update({
    where: { id },
    data: {
      title,
      description,
      completed,
    },
  });
  reply.send(updatedMilestone);
};

export const deleteMilestone = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  await request.server.prisma.milestone.delete({
    where: { id },
  });
  reply.send({ message: 'Milestone deleted successfully' });
};
