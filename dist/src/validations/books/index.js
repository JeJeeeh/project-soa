"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booksValidation_1 = __importDefault(require("./booksValidation"));
const bookValidation_1 = __importDefault(require("./bookValidation"));
const schema = {
    booksSchema: booksValidation_1.default,
    bookSchema: bookValidation_1.default
};
exports.default = schema;
