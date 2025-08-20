"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const getSettings = async (request, reply) => {
    const { userId } = request.user;
    const settings = await request.server.prisma.settings.findUnique({
        where: { userId },
    });
    reply.send(settings);
};
exports.getSettings = getSettings;
const updateSettings = async (request, reply) => {
    const { userId } = request.user;
    const { notificationsEnabled, theme } = request.body;
    const updatedSettings = await request.server.prisma.settings.update({
        where: { userId },
        data: {
            notificationsEnabled,
            theme,
        },
    });
    reply.send(updatedSettings);
};
exports.updateSettings = updateSettings;
