"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
const clientException_1 = require("../../exceptions/clientException");
const prisma = new client_1.PrismaClient();
const uniqueUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        user = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    }
    catch (error) {
        throw new clientException_1.BadRequestExceptions('Something went wrong when checking for username');
    }
    finally {
        yield prisma.$disconnect();
    }
    if (user) {
        throw new clientException_1.BadRequestExceptions('Username already exists');
    }
});
const uniqueEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }
    catch (error) {
        throw new clientException_1.BadRequestExceptions('Something went wrong when checking for email');
    }
    finally {
        yield prisma.$disconnect();
    }
    if (user) {
        throw new clientException_1.BadRequestExceptions('Email already exists');
    }
});
const registerSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).required().external(uniqueUsername).label('Username').messages({
        'string.empty': '{{#label}} is required',
        'string.min': '{{#label}} must be at least 3 characters long',
    }),
    email: joi_1.default.string().email().required().external(uniqueEmail).label('Email').messages({
        'string.empty': '{{#label}} is required',
        'string.email': '{{#label}} must be a valid email',
    }),
    name: joi_1.default.string().min(3).required().label('Name').messages({
        'string.empty': '{{#label}} is required',
        'string.min': '{{#label}} must be at least 3 characters long',
    }),
    password: joi_1.default.string().min(8).required().label('Password').messages({
        'string.empty': '{{#label}} is required',
        'string.min': '{{#label}} must be at least 8 characters long',
    }),
    // eslint-disable-next-line camelcase
    password_confirmation: joi_1.default.string().valid(joi_1.default.ref('password')).label('Password Confirmation').required().messages({
        'string.empty': '{{#label}} is required',
        'any.only': '{{#label}} must match password',
    }),
});
exports.default = registerSchema;
