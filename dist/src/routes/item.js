"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const itemController_1 = require("../controllers/itemController");
const router = (0, express_1.Router)();
router.get('/:collectionId/items', middlewares_1.default.hasValidBearerToken, (req, res, next) => {
    void (0, itemController_1.getItems)(req, res).catch(next);
});
router.get('/:collectionId/items/:itemId', middlewares_1.default.hasValidBearerToken, (req, res, next) => {
    void (0, itemController_1.getSingleItem)(req, res).catch(next);
});
router.post('/:collectionId/items', middlewares_1.default.hasValidBearerToken, (req, res, next) => {
    void (0, itemController_1.addItem)(req, res).catch(next);
});
router.delete('/:collectionId/items/:itemId', middlewares_1.default.hasValidBearerToken, (req, res, next) => {
    void (0, itemController_1.deleteItem)(req, res).catch(next);
});
exports.default = router;
