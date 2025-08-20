"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
async function authPlugin(fastify) {
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
}
exports.default = (0, fastify_plugin_1.default)(authPlugin);
