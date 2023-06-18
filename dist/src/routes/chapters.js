"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const chapterController_1 = require("../controllers/chapterController");
const router = (0, express_1.Router)();
router.get('/:bibleId/books/:bookId/chapters', middlewares_1.default.hasValidBearerToken, middlewares_1.default.hasApiHits, (req, res, next) => {
    void (0, chapterController_1.getChapters)(req, res).catch(next);
});
router.get('/:bibleId/chapters/:chapterId', middlewares_1.default.hasValidBearerToken, middlewares_1.default.hasApiHits, (req, res, next) => {
    void (0, chapterController_1.getChapter)(req, res).catch(next);
});
exports.default = router;
