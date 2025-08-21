"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
    databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/my_db1',
    sessionSecret: process.env.SESSION_SECRET || 'super_secret_default_key',
    jwtSecret: process.env.JWT_SECRET || 'super_secret_default_key',
};
