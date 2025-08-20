"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const progress_1 = require("../handlers/progress");
const progressRoutes = async (server) => {
    server.get('/progress', { preHandler: [server.authenticate] }, progress_1.getProgress);
    server.put('/progress', { preHandler: [server.authenticate] }, progress_1.updateProgress);
};
exports.default = progressRoutes;
