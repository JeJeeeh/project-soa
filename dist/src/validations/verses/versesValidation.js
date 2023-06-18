"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const versesSchema = joi_1.default.object({
    bibleId: joi_1.default.string().required().messages({
        'string.empty': 'Bible ID is required',
    }),
    chapterId: joi_1.default.string().required().messages({
        'string.empty': 'Chapter ID is required',
    }),
});
exports.default = versesSchema;
