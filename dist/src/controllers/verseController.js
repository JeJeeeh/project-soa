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
exports.getVerse = exports.getVerses = void 0;
const axiosConfig_1 = __importDefault(require("../config/axiosConfig"));
const statusCode_1 = require("../helpers/statusCode");
const verses_1 = __importDefault(require("../validations/verses"));
const sanitizer_1 = require("../helpers/sanitizer");
const joiException_1 = require("../exceptions/joiException");
const getVerses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bibleId, chapterId } = req.params;
    const verseResponse = yield axiosConfig_1.default.get(`/bibles/${bibleId}/chapters/${chapterId}/verses`);
    const verses = verseResponse.data.data;
    res.status(statusCode_1.StatusCode.OK).json(verses);
    return;
});
exports.getVerses = getVerses;
const getVerse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = req.query;
    const { bibleId, verseId } = req.params;
    try {
        yield verses_1.default.verseSchema.verseParamsSchema.validateAsync(req.params);
        yield verses_1.default.verseSchema.verseQueryScehma.validateAsync(q);
    }
    catch (err) {
        const error = err;
        throw new joiException_1.JoiExceptions(error);
    }
    const filteredQ = (0, sanitizer_1.sanitizeNullObject)(q);
    const verseResponse = yield axiosConfig_1.default.get(`/bibles/${bibleId}/verses/${verseId}`, {
        params: filteredQ,
    });
    const verse = verseResponse.data.data;
    res.status(statusCode_1.StatusCode.OK).json(verse);
    return;
});
exports.getVerse = getVerse;
