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
exports.getChapter = exports.getChapters = void 0;
const joi_1 = __importDefault(require("joi"));
const statusCode_1 = require("../helpers/statusCode");
const axiosConfig_1 = __importDefault(require("../config/axiosConfig"));
const sanitizer_1 = require("../helpers/sanitizer");
const joiException_1 = require("../exceptions/joiException");
const getChapters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = { bibleId: req.params.bibleId, bookId: req.params.bookId };
    const regexQuery = new RegExp(/^[^:].*$/);
    const schema = joi_1.default.object({
        bibleId: joi_1.default.string().pattern(regexQuery).required(),
        bookId: joi_1.default.string().pattern(regexQuery).required(),
    });
    try {
        yield schema.validateAsync(q);
    }
    catch (err) {
        const error = err;
        throw new joiException_1.JoiExceptions(error);
    }
    const chaptersResponse = yield axiosConfig_1.default.get(`/bibles/${q.bibleId}/books/${q.bookId}/chapters`);
    const chapters = chaptersResponse.data.data;
    res.status(statusCode_1.StatusCode.OK).json(chapters);
});
exports.getChapters = getChapters;
const getChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const q = { bibleId: req.params.bibleId, chapterId: req.params.chapterId };
    const regexQuery = new RegExp(/^[^:].*$/);
    const schema = joi_1.default.object({
        bibleId: joi_1.default.string().pattern(regexQuery).required(),
        chapterId: joi_1.default.string().pattern(regexQuery).required(),
    });
    try {
        yield schema.validateAsync(q);
    }
    catch (err) {
        const error = err;
        throw new joiException_1.JoiExceptions(error);
    }
    const param = {
        'content-type': req.query['content-type'],
        'include-notes': (_a = Boolean(req.query['include-notes'])) !== null && _a !== void 0 ? _a : false,
        'include-titles': (_b = Boolean(req.query['include-tiles'])) !== null && _b !== void 0 ? _b : true,
        'include-chapter-numbers': (_c = Boolean(req.query['include-chapter-numbers'])) !== null && _c !== void 0 ? _c : false,
        'include-verse-numbers': (_d = Boolean(req.query['include-verse-numbers'])) !== null && _d !== void 0 ? _d : true,
        'include-verse-spans': (_e = Boolean(req.query['include-verse-spans'])) !== null && _e !== void 0 ? _e : false,
        'parallels': req.query['parallels'],
    };
    const filteredParam = (0, sanitizer_1.sanitizeNullObject)(param);
    const chapterResponse = yield axiosConfig_1.default.get(`/bibles/${q.bibleId}/chapters/${q.chapterId}`, {
        params: filteredParam,
    });
    delete chapterResponse.data.meta;
    const chapter = chapterResponse.data.data;
    res.status(statusCode_1.StatusCode.OK).json(chapter);
});
exports.getChapter = getChapter;
