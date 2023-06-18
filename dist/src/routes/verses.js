"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const verseController_1 = require("../controllers/verseController");
const router = (0, express_1.Router)();
router.get('/:bibleId/chapters/:chapterId/verses', middlewares_1.default.hasValidBearerToken, middlewares_1.default.hasApiHits, (req, res, next) => {
    void (0, verseController_1.getVerses)(req, res).catch(next);
});
router.get('/:bibleId/verses/:verseId', middlewares_1.default.hasValidBearerToken, middlewares_1.default.hasApiHits, (req, res, next) => {
    void (0, verseController_1.getVerse)(req, res).catch(next);
});
exports.default = router;
