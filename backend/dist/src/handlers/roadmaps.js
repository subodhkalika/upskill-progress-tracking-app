"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoadmap = exports.updateRoadmap = exports.getRoadmap = exports.getRoadmaps = exports.createRoadmap = void 0;
const createRoadmap = async (request, reply) => {
    const userId = request.user.id;
    const { title, description, isPublic } = request.body;
    try {
        const newRoadmap = await request.server.prisma.roadmap.create({
            data: {
                title,
                description,
                isPublic: isPublic ?? false,
                userId
            }
        });
        return reply.status(201).send({ message: 'Roadmap created successfully.', roadmap: newRoadmap });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.createRoadmap = createRoadmap;
const getRoadmaps = async (request, reply) => {
    const userId = request.user.id;
    try {
        const roadmaps = await request.server.prisma.roadmap.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return reply.status(200).send({ roadmaps });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getRoadmaps = getRoadmaps;
const getRoadmap = async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    try {
        const roadmap = await request.server.prisma.roadmap.findFirst({
            where: { id, userId }
        });
        if (!roadmap) {
            return reply.status(404).send({ message: 'Roadmap not found.' });
        }
        return reply.status(200).send({ roadmap });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getRoadmap = getRoadmap;
const updateRoadmap = async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    const updateData = request.body;
    try {
        const roadmap = await request.server.prisma.roadmap.updateMany({
            where: { id, userId },
            data: updateData
        });
        if (roadmap.count === 0) {
            return reply.status(404).send({ message: 'Roadmap not found.' });
        }
        return reply.status(200).send({ message: 'Roadmap updated successfully.' });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.updateRoadmap = updateRoadmap;
const deleteRoadmap = async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    try {
        const roadmap = await request.server.prisma.roadmap.deleteMany({
            where: { id, userId }
        });
        if (roadmap.count === 0) {
            return reply.status(404).send({ message: 'Roadmap not found.' });
        }
        return reply.status(200).send({ message: 'Roadmap deleted successfully.' });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.deleteRoadmap = deleteRoadmap;
