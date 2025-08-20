"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMilestone = exports.updateMilestone = exports.createMilestone = exports.getMilestone = exports.getMilestones = void 0;
const getMilestones = async (request, reply) => {
    const { roadmapId } = request.query;
    const milestones = await request.server.prisma.milestone.findMany({
        where: { roadmapId },
    });
    reply.send(milestones);
};
exports.getMilestones = getMilestones;
const getMilestone = async (request, reply) => {
    const { id } = request.params;
    const milestone = await request.server.prisma.milestone.findUnique({
        where: { id },
    });
    reply.send(milestone);
};
exports.getMilestone = getMilestone;
const createMilestone = async (request, reply) => {
    const { title, description, roadmapId } = request.body;
    const newMilestone = await request.server.prisma.milestone.create({
        data: {
            title,
            description,
            roadmapId,
        },
    });
    reply.send(newMilestone);
};
exports.createMilestone = createMilestone;
const updateMilestone = async (request, reply) => {
    const { id } = request.params;
    const { title, description, completed } = request.body;
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
exports.updateMilestone = updateMilestone;
const deleteMilestone = async (request, reply) => {
    const { id } = request.params;
    await request.server.prisma.milestone.delete({
        where: { id },
    });
    reply.send({ message: 'Milestone deleted successfully' });
};
exports.deleteMilestone = deleteMilestone;
