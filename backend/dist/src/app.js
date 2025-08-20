"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const config_1 = require("./config");
const db_1 = __importDefault(require("./plugins/db"));
const auth_1 = __importDefault(require("./plugins/auth"));
const auth_2 = __importDefault(require("./routes/auth"));
const resources_1 = __importDefault(require("./routes/resources")); // Import new routes
const roadmaps_1 = __importDefault(require("./routes/roadmaps")); // Import roadmap routes
const tasks_1 = __importDefault(require("./routes/tasks")); // Import task routes
const milestones_1 = __importDefault(require("./routes/milestones"));
const progress_1 = __importDefault(require("./routes/progress"));
const settings_1 = __importDefault(require("./routes/settings"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const app = (0, fastify_1.default)({
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                ignore: 'pid,hostname',
            },
        },
    },
});
const loadJwtConfig = () => {
    return {
        secret: config_1.config.jwtSecret,
        sign: {
            expiresIn: '15m', // Access token expires in 15 minutes
        },
        cookie: {
            cookieName: 'refreshToken', // Name of the cookie for refresh token
            signed: false, // Set to true if you want to sign the cookie
        },
        messages: {
            badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
            noAuthorizationInHeaderMessage: 'Authorization header is missing!',
            authorizationTokenExpiredMessage: 'Authorization token expired',
            authorizationTokenInvalidMessage: 'Authorization token is invalid!',
            authorizationTokenUntrustedMessage: 'Authorization token is untrusted!',
        },
        decode: { complete: true },
        verify: {
            // This is used to verify the token.
            // We are adding userId to the payload.
            // So we need to tell jwt.verify to expect it.
            // Otherwise it will throw an error.
            allowedIss: ['localhost'],
            allowedAud: ['localhost'],
        }
    };
};
const loadRoutes = async () => {
    // Register auth routes
    await app.register(auth_2.default, { prefix: '/auth' });
    app.log.info('Authentication routes registered.');
    // Register resources routes
    await app.register(resources_1.default, { prefix: '/resources' }); // Register new routes
    app.log.info('Resources routes registered.');
    // Register roadmap routes
    await app.register(roadmaps_1.default, { prefix: '/roadmaps' }); // Register roadmap routes
    app.log.info('Roadmap routes registered.');
    // Register task routes
    await app.register(tasks_1.default, { prefix: '/tasks' }); // Register task routes
    app.log.info('Task routes registered.');
    // Register milestone routes
    await app.register(milestones_1.default, { prefix: '/milestones' });
    app.log.info('Milestone routes registered.');
    // Register progress routes
    await app.register(progress_1.default, { prefix: '/progress' });
    app.log.info('Progress routes registered.');
    // Register settings routes
    await app.register(settings_1.default, { prefix: '/settings' });
    app.log.info('Settings routes registered.');
    // Root route
    app.get('/', async (request, reply) => {
        reply.send({ message: 'Fastify API is running!' });
    });
};
async function bootstrap() {
    try {
        await app.register(cors_1.default, {
            origin: 'http://localhost:3001', // Or set to your frontend URL like "http://localhost:3001"
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true,
        });
        // Register DB plugin first
        await app.register(db_1.default);
        app.log.info('Prisma DB plugin registered.');
        app.register(cookie_1.default);
        app.register(jwt_1.default, loadJwtConfig());
        app.log.info('JWT plugin registered.');
        // Register auth plugin
        await app.register(auth_1.default);
        app.log.info('Auth plugin registered.');
        await loadRoutes();
        app.log.info('Routes loaded.');
        // Start server
        await app.listen({ port: config_1.config.port, host: '0.0.0.0' });
        app.log.info(`Server listening on port ${config_1.config.port}`);
    }
    catch (err) {
        app.log.error(err, 'Application failed to start:');
        process.exit(1);
    }
}
bootstrap();
