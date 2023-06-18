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
exports.getBible = exports.getBibles = void 0;
const axiosConfig_1 = __importDefault(require("../config/axiosConfig"));
const statusCode_1 = require("../helpers/statusCode");
const sanitizer_1 = require("../helpers/sanitizer");
const joi_1 = __importDefault(require("joi"));
const clientException_1 = require("../exceptions/clientException");
const getBibles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = req.query;
    const schema = joi_1.default.object({
        language: joi_1.default.string().max(3).optional().allow('', null),
        abbreviation: joi_1.default.string().max(3).optional().allow('', null),
        name: joi_1.default.string().max(50).optional().allow('', null),
        ids: joi_1.default.string().max(50).optional().allow('', null),
    });
    try {
        yield schema.validateAsync(q);
    }
    catch (err) {
        throw new clientException_1.BadRequestExceptions('Invalid parameters');
    }
    const filteredQ = (0, sanitizer_1.sanitizeNullObject)(q);
    const bibleResponse = yield axiosConfig_1.default.get('/bibles', {
        params: filteredQ,
    });
    const bible = bibleResponse.data.data.map(rest => {
        delete rest.audioBibles;
        return rest;
    });
    if (!bible.length) {
        throw new clientException_1.BadRequestExceptions('Bible not found');
    }
    res.status(statusCode_1.StatusCode.OK).json(bible);
    return;
});
exports.getBibles = getBibles;
const getBible = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bibleId = req.params.bibleId;
    const bibleResponse = yield axiosConfig_1.default.get(`/bibles/${bibleId}`);
    const bible = bibleResponse.data.data;
    delete bible.audioBibles;
    res.status(statusCode_1.StatusCode.OK).json(bible);
    return;
});
exports.getBible = getBible;
