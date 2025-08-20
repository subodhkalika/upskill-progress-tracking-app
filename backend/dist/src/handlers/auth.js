"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logoutUser = exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const password_1 = require("../utils/password");
/**
 * Register new user
 */
const registerUser = async (request, reply) => {
    const { email, password } = request.body;
    try {
        const existingUser = await request.server.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return reply.status(409).send({ message: 'User already exists.' });
        }
        const passwordHash = await (0, password_1.hashPassword)(password);
        const newUser = await request.server.prisma.user.create({
            data: { email, passwordHash },
            select: { id: true, email: true, createdAt: true }
        });
        return reply.status(201).send({ message: 'User registered successfully.', user: newUser });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.registerUser = registerUser;
/**
 * Login existing user
 */
const loginUser = async (request, reply) => {
    const { email, password } = request.body;
    try {
        const user = await request.server.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return reply.status(401).send({ message: 'Invalid email or password.' });
        }
        const isPasswordValid = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!isPasswordValid) {
            return reply.status(401).send({ message: 'Invalid email or password.' });
        }
        const accessToken = request.server.jwt.sign({ email: user.email }, { expiresIn: '15m' });
        const refreshToken = request.server.jwt.sign({ email: user.email }, { expiresIn: '7d' });
        // Set refresh token as an HTTP-only cookie
        reply.setCookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
            path: '/refresh', // Only send the cookie to the /refresh endpoint
            sameSite: 'strict', // Protects against CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        return reply.status(200).send({ message: 'Login successful.', accessToken });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.loginUser = loginUser;
/**
 * Refresh access token
 */
const refreshAccessToken = async (request, reply) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken) {
            return reply.status(401).send({ message: 'Refresh token not found.' });
        }
        const decodedToken = request.server.jwt.verify(refreshToken);
        const accessToken = request.server.jwt.sign({ email: decodedToken.email }, { expiresIn: '15m' });
        return reply.status(200).send({ accessToken });
    }
    catch (err) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
};
exports.refreshAccessToken = refreshAccessToken;
/**
 * Logout (noop for JWT)
 */
const logoutUser = async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;
    if (refreshToken) {
        reply.clearCookie('refreshToken', { path: '/refresh' });
    }
    return reply.status(200).send({ message: 'Logged out successfully.' });
};
exports.logoutUser = logoutUser;
/**
 * Get user profile
 */
const getProfile = async (request, reply) => {
    const user = request.user;
    return reply.status(200).send({ message: 'Profile retrieved.', user });
};
exports.getProfile = getProfile;
