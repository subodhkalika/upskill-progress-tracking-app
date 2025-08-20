"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTask = exports.getTasks = exports.createTask = void 0;
const createTask = async (request, reply) => {
    const userId = request.user.id;
    const { title, resourceId } = request.body;
    try {
        const newTask = await request.server.prisma.task.create({
            data: {
                title,
                resourceId,
                userId
            }
        });
        return reply.status(201).send({ message: 'Task created successfully.', task: newTask });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.createTask = createTask;
const getTasks = async (request, reply) => {
    const userId = request.user.id;
    try {
        const tasks = await request.server.prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return reply.status(200).send({ tasks });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getTasks = getTasks;
const getTask = async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    try {
        const task = await request.server.prisma.task.findFirst({
            where: { id, userId }
        });
        if (!task) {
            return reply.status(404).send({ message: 'Task not found.' });
        }
        return reply.status(200).send({ task });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getTask = getTask;
const updateTask = async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    const updateData = request.body;
    try {
        const task = await request.server.prisma.task.updateMany({
            where: { id, userId },
            data: updateData
        });
        if (task.count === 0) {
            return reply.status(404).send({ message: 'Task not found.' });
        }
        return reply.status(200).send({ message: 'Task updated successfully.' });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    try {
        const task = await request.server.prisma.task.deleteMany({
            where: { id, userId }
        });
        if (task.count === 0) {
            return reply.status(404).send({ message: 'Task not found.' });
        }
        return reply.status(200).send({ message: 'Task deleted successfully.' });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.deleteTask = deleteTask;
