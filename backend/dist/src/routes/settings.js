"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../handlers/settings");
const settingsRoutes = async (server) => {
    server.get('/settings', { preHandler: [server.authenticate] }, settings_1.getSettings);
    server.put('/settings', { preHandler: [server.authenticate] }, settings_1.updateSettings);
};
exports.default = settingsRoutes;
