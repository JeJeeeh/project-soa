"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hasValidBearerToken_1 = __importDefault(require("../middlewares/hasValidBearerToken"));
const dailybreadController_1 = require("../controllers/dailybreadController");
const hasDailyBread_1 = __importDefault(require("../middlewares/hasDailyBread"));
const router = (0, express_1.Router)();
router.get('/dailybread', hasValidBearerToken_1.default, hasDailyBread_1.default, (req, res, next) => {
    void (0, dailybreadController_1.getDailyBread)(req, res).catch(next);
});
exports.default = router;
