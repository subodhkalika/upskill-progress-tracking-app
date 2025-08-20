"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const prisma_1 = __importDefault(require("../database/prisma"));
/**
 * Fastify plugin to expose the Prisma client instance.
 * This makes `fastify.prisma` available throughout the application.
 */
async function dbPlugin(fastify, options) {
    fastify.decorate('prisma', prisma_1.default);
    // Close Prisma client when the Fastify server closes
    fastify.addHook('onClose', async (instance) => {
        await instance.prisma.$disconnect();
    });
}
exports.default = (0, fastify_plugin_1.default)(dbPlugin, {
    name: 'db-plugin',
});
