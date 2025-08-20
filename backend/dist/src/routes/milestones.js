"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const milestones_1 = require("../handlers/milestones");
const milestoneRoutes = async (server) => {
    server.get('/milestones', { preHandler: [server.authenticate] }, milestones_1.getMilestones);
    server.get('/milestones/:id', { preHandler: [server.authenticate] }, milestones_1.getMilestone);
    server.post('/milestones', { preHandler: [server.authenticate] }, milestones_1.createMilestone);
    server.put('/milestones/:id', { preHandler: [server.authenticate] }, milestones_1.updateMilestone);
    server.delete('/milestones/:id', { preHandler: [server.authenticate] }, milestones_1.deleteMilestone);
};
exports.default = milestoneRoutes;
