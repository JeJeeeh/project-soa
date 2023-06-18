"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registerValidation_1 = __importDefault(require("./registerValidation"));
const loginValidation_1 = __importDefault(require("./loginValidation"));
const schema = {
    registerSchema: registerValidation_1.default,
    loginSchema: loginValidation_1.default,
};
exports.default = schema;
