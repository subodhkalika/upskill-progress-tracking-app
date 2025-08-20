"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
async function authPlugin(fastify) {
    // JWT authentication middleware
    fastify.decorate('jwtAuth', async function (request, reply) {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ message: 'No token provided' });
            }
            const decoded = request.server.jwt.verify(token);
            const user = await request.server.prisma.user.findUnique({
                where: { email: decoded.email },
                select: { id: true, email: true }
            });
            if (!user) {
                return reply.status(401).send({ message: 'Invalid token' });
            }
            request.user = user;
        }
        catch (err) {
            return reply.status(401).send({ message: 'Invalid token' });
        }
    });
    // Auth decorator for backward compatibility
    fastify.decorate('auth', function (handlers) {
        return handlers;
    });
}
exports.default = (0, fastify_plugin_1.default)(authPlugin);
