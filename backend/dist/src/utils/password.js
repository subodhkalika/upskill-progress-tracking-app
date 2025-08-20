"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt hashing
/**
 * Hashes a plain-text password using bcrypt.
 * @param password The plain-text password to hash.
 * @returns A Promise that resolves to the hashed password string.
 */
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
/**
 * Compares a plain-text password with a hashed password.
 * @param password The plain-text password.
 * @param hash The hashed password to compare against.
 * @returns A Promise that resolves to a boolean indicating if the passwords match.
 */
const comparePassword = async (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
