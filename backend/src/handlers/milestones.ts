import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateMilestoneInput, UpdateMilestoneInput } from '../interfaces/milestone';

export const createMilestone = async (request: FastifyRequest<{ Body: CreateMilestoneInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { title, description, dueDate, roadmapId } = request.body;

  try {
    // Verify the roadmap belongs to the user
    const roadmap = await request.server.prisma.roadmap.findFirst({
      where: { id: roadmapId, userId }
    });

    if (!roadmap) {
      return reply.status(404).send({ message: 'Roadmap not found or you do not have permission to add a milestone to it.' });
    }

    const newMilestone = await request.server.prisma.milestone.create({
      data: {
        title,
        description,
        dueDate,
        roadmapId
      }
    });
    return reply.status(201).send(newMilestone);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getAllMilestones = async (request: FastifyRequest<{ Querystring: { roadmapId?: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { roadmapId } = request.query;

  try {
    const milestones = await request.server.prisma.milestone.findMany({
      where: {
        roadmap: {
          userId,
          id: roadmapId,
        },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        tasks: true,
      },
    });
    return reply.status(200).send(milestones);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getMilestoneById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const milestone = await request.server.prisma.milestone.findFirst({
      where: { 
        id,
        roadmap: {
          userId
        } 
      },
      include: {
        tasks: true
      }
    });
    if (!milestone) {
      return reply.status(404).send({ message: 'Milestone not found.' });
    }
    return reply.status(200).send(milestone);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateMilestoneById = async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateMilestoneInput }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  const updateData = request.body;
  try {
    const milestone = await request.server.prisma.milestone.findFirst({
        where: {
            id,
            roadmap: {
                userId
            }
        }
    });

    if (!milestone) {
        return reply.status(404).send({ message: 'Milestone not found or you do not have permission to update it.' });
    }

    const updatedMilestone = await request.server.prisma.milestone.update({
      where: { id },
      data: updateData
    });

    return reply.status(200).send(updatedMilestone);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteMilestoneById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = request.user.id;
  const { id } = request.params;
  try {
    const milestone = await request.server.prisma.milestone.findFirst({
        where: {
            id,
            roadmap: {
                userId
            }
        }
    });

    if (!milestone) {
        return reply.status(404).send({ message: 'Milestone not found or you do not have permission to delete it.' });
    }

    await request.server.prisma.milestone.delete({
      where: { id }
    });

    return reply.status(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};
