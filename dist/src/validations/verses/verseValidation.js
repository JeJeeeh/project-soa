"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const contentType_1 = require("../../helpers/contentType");
const verseParamsSchema = joi_1.default.object({
    bibleId: joi_1.default.string().required().messages({
        'string.empty': 'Bible ID is required',
    }),
    verseId: joi_1.default.string().required().messages({
        'string.empty': 'Verse ID is required',
    }),
});
const verseQueryScehma = joi_1.default.object({
    "content-type": joi_1.default.string().optional().valid(contentType_1.ContentType.JSON, contentType_1.ContentType.HTML, contentType_1.ContentType.TEXT).messages({
        'string.valid': 'Content type must be one of the following: json, html, text',
    }),
    "include-notes": joi_1.default.boolean().optional().messages({
        'boolean.base': 'Include notes must be a boolean',
    }),
    "include-titles": joi_1.default.boolean().optional().messages({
        'boolean.base': 'Include titles must be a boolean',
    }),
    "include-chapter-numbers": joi_1.default.boolean().optional().messages({
        'boolean.base': 'Include chapter numbers must be a boolean',
    }),
    "include-verse-numbers": joi_1.default.boolean().optional().messages({
        'boolean.base': 'Include verse numbers must be a boolean',
    }),
    "include-verse-spans": joi_1.default.boolean().optional().messages({
        'boolean.base': 'Include verse spans must be a boolean',
    }),
    "parallels": joi_1.default.string().optional().messages({
        'string.base': 'Parallels must be a string',
    }),
    "use-org-id": joi_1.default.boolean().optional().messages({
        'boolean.base': 'Use org ID must be a boolean',
    }),
});
const verseSchema = {
    verseParamsSchema,
    verseQueryScehma,
};
exports.default = verseSchema;
