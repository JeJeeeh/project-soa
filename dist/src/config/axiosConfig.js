"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const bibleExceptions_1 = require("../exceptions/bibleExceptions");
const API_KEY = process.env.API_KEY || '';
const axios = axios_1.default.create({
    baseURL: 'https://api.scripture.api.bible/v1',
    headers: {
        'api-key': API_KEY,
    },
});
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    var _a;
    const err = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
    throw new bibleExceptions_1.BibleExceptions(err.statusCode, err.message);
});
exports.default = axios;
