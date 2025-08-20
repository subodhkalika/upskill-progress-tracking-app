"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgress = exports.getProgress = void 0;
const getProgress = async (request, reply) => {
    const { userId } = request.user;
    const progress = await request.server.prisma.progress.findUnique({
        where: { userId },
    });
    reply.send(progress);
};
exports.getProgress = getProgress;
const updateProgress = async (request, reply) => {
    const { userId } = request.user;
    const { streaks, points } = request.body;
    const updatedProgress = await request.server.prisma.progress.update({
        where: { userId },
        data: {
            streaks,
            points,
        },
    });
    reply.send(updatedProgress);
};
exports.updateProgress = updateProgress;
