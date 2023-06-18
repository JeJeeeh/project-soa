"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const versesValidation_1 = __importDefault(require("./versesValidation"));
const verseValidation_1 = __importDefault(require("./verseValidation"));
const schema = {
    versesSchema: versesValidation_1.default,
    verseSchema: verseValidation_1.default
};
exports.default = schema;
