"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const booksSchema = joi_1.default.object({
    "include-chapters": joi_1.default.boolean(),
    "include-chapters-and-sections": joi_1.default.boolean(),
});
exports.default = booksSchema;
