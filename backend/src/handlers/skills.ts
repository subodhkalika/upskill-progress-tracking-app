import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateSkillInput, UpdateSkillInput } from '../interfaces/skill';
import { isPrismaErrorCode, isPrismaUniqueConstraintViolation } from '../utils/error';

export const createSkill = async (request: FastifyRequest<{ Body: CreateSkillInput }>, reply: FastifyReply) => {
  try {
    const newSkill = await request.server.prisma.skill.create({
      data: request.body
    });
    return reply.status(201).send(newSkill);
  } catch (err) {
    request.log.error(err);
    // Check for unique constraint violation
    if (isPrismaUniqueConstraintViolation(err)) {
      return reply.status(409).send({ message: 'A skill with this name already exists.' });
    }
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getAllSkills = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const skills = await request.server.prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });
    return reply.status(200).send(skills);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const getSkillById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  try {
    const skill = await request.server.prisma.skill.findUnique({
      where: { id },
      include: {
        roadmaps: true,
        tasks: true,
        resources: true
      }
    });
    if (!skill) {
      return reply.status(404).send({ message: 'Skill not found.' });
    }
    return reply.status(200).send(skill);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const updateSkillById = async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateSkillInput }>, reply: FastifyReply) => {
  const { id } = request.params;
  try {
    const updatedSkill = await request.server.prisma.skill.update({
      where: { id },
      data: request.body
    });
    return reply.status(200).send(updatedSkill);
  } catch (err) {
    request.log.error(err);
    if (isPrismaErrorCode(err, 'P2025')) {
        return reply.status(404).send({ message: 'Skill not found.' });
    }
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};

export const deleteSkillById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  try {
    await request.server.prisma.skill.delete({
      where: { id }
    });
    return reply.status(204).send();
  } catch (err) {
    request.log.error(err);
    if (isPrismaErrorCode(err, 'P2025')) {
        return reply.status(404).send({ message: 'Skill not found.' });
    }
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};