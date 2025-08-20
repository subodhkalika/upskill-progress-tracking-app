"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.updateResource = exports.getResource = exports.getResources = exports.createResource = void 0;
const createResource = async (request, reply) => {
    const userId = request.user.userId;
    const { title, url, type, notes, roadmapId } = request.body;
    try {
        const newResource = await request.server.prisma.resource.create({
            data: {
                title,
                url,
                type,
                notes,
                roadmapId,
                userId
            }
        });
        return reply.status(201).send({ message: 'Resource created successfully.', resource: newResource });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.createResource = createResource;
const getResources = async (request, reply) => {
    const userId = request.user.userId;
    try {
        const resources = await request.server.prisma.resource.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return reply.status(200).send({ resources });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getResources = getResources;
const getResource = async (request, reply) => {
    const userId = request.user.userId;
    const { id } = request.params;
    try {
        const resource = await request.server.prisma.resource.findFirst({
            where: { id, userId }
        });
        if (!resource) {
            return reply.status(404).send({ message: 'Resource not found.' });
        }
        return reply.status(200).send({ resource });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getResource = getResource;
const updateResource = async (request, reply) => {
    const userId = request.user.userId;
    const { id } = request.params;
    const updateData = request.body;
    try {
        const resource = await request.server.prisma.resource.updateMany({
            where: { id, userId },
            data: updateData
        });
        if (resource.count === 0) {
            return reply.status(404).send({ message: 'Resource not found.' });
        }
        return reply.status(200).send({ message: 'Resource updated successfully.' });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.updateResource = updateResource;
const deleteResource = async (request, reply) => {
    const userId = request.user.userId;
    const { id } = request.params;
    try {
        const resource = await request.server.prisma.resource.deleteMany({
            where: { id, userId }
        });
        if (resource.count === 0) {
            return reply.status(404).send({ message: 'Resource not found.' });
        }
        return reply.status(200).send({ message: 'Resource deleted successfully.' });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.deleteResource = deleteResource;
