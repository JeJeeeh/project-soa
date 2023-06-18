"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const bookController_1 = require("../controllers/bookController");
const router = (0, express_1.Router)();
router.get('/:bibleId/books', middlewares_1.default.hasValidBearerToken, middlewares_1.default.hasApiHits, (req, res, next) => {
    void (0, bookController_1.getBooks)(req, res).catch(next);
});
router.get('/:bibleId/books/:bookId', middlewares_1.default.hasValidBearerToken, middlewares_1.default.hasApiHits, (req, res, next) => {
    void (0, bookController_1.getBook)(req, res).catch(next);
});
exports.default = router;
