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
exports.getBook = exports.getBooks = void 0;
const axiosConfig_1 = __importDefault(require("../config/axiosConfig"));
const statusCode_1 = require("../helpers/statusCode");
const joiException_1 = require("../exceptions/joiException");
const books_1 = __importDefault(require("../validations/books"));
const sanitizer_1 = require("../helpers/sanitizer");
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bibleId } = req.params;
    const q = req.query;
    try {
        yield books_1.default.booksSchema.validateAsync(q);
    }
    catch (err) {
        const error = err;
        ;
        throw new joiException_1.JoiExceptions(error);
    }
    const filteredQ = (0, sanitizer_1.sanitizeNullObject)(q);
    const booksResponse = yield axiosConfig_1.default.get(`/bibles/${bibleId}/books`, {
        params: filteredQ,
    });
    const books = booksResponse.data.data;
    res.status(statusCode_1.StatusCode.OK).json(books);
    return;
});
exports.getBooks = getBooks;
const getBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bibleId, bookId } = req.params;
    const q = req.query;
    try {
        yield books_1.default.bookSchema.validateAsync(q);
    }
    catch (err) {
        const error = err;
        throw new joiException_1.JoiExceptions(error);
    }
    const filteredQ = (0, sanitizer_1.sanitizeNullObject)(q);
    const bookResponse = yield axiosConfig_1.default.get(`/bibles/${bibleId}/books/${bookId}`, {
        params: filteredQ,
    });
    const book = bookResponse.data.data;
    res.status(statusCode_1.StatusCode.OK).json(book);
    return;
});
exports.getBook = getBook;
