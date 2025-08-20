"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../handlers/auth");
/**
 * Authentication routes plugin for Fastify.
 * Defines endpoints for user registration, login, logout, and profile retrieval.
 */
const authRoutes = async (fastify, options) => {
    // Route for user registration
    fastify.post('/register', auth_1.registerUser);
    // Route for user login
    fastify.post('/login', auth_1.loginUser);
    // Route for user logout
    fastify.post('/logout', auth_1.logoutUser);
    // Protected route to get user profile
    // This route requires authentication.
    fastify.get('/profile', { onRequest: [fastify.authenticate] }, auth_1.getProfile);
};
exports.default = authRoutes;
