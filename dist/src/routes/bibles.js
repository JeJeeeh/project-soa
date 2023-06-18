"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const bibleController_1 = require("../controllers/bibleController");
const router = (0, express_1.Router)();
router.get('/', middlewares_1.default.hasValidBearerToken, middlewares_1.default.hasApiHits, (req, res, next) => {
    void (0, bibleController_1.getBibles)(req, res).catch(next);
});
router.get('/:bibleId', middlewares_1.default.hasValidBearerToken, middlewares_1.default.hasApiHits, (req, res, next) => {
    void (0, bibleController_1.getBible)(req, res).catch(next);
});
exports.default = router;
