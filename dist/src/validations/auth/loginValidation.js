"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const loginSchema = joi_1.default.object({
    username: joi_1.default.string(),
    email: joi_1.default.string().email().messages({
        'string.email': 'Email must be a valid email',
    }),
    password: joi_1.default.string().min(8).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
    }),
}).xor('username', 'email')
    .messages({
    'object.missing': 'Username or email is required',
    'object.xor': 'Only one of username or email is required',
})
    .with('username', 'password')
    .with('email', 'password');
exports.default = loginSchema;
