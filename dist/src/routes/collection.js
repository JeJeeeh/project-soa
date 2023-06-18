"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const middlewares_1 = __importDefault(require("../middlewares"));
const collectionController_1 = require("../controllers/collectionController");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
router.get('/', middlewares_1.default.hasValidBearerToken, (req, res, next) => {
    void (0, collectionController_1.getAllCollection)(req, res).catch(next);
});
router.post('/', middlewares_1.default.hasValidBearerToken, multerConfig_1.default.single('image'), (req, res, next) => {
    void (0, collectionController_1.addCollection)(req, res).catch(next);
});
router.get('/:id', middlewares_1.default.hasValidBearerToken, (req, res, next) => {
    void (0, collectionController_1.getSingleCollection)(req, res).catch(next);
});
router.put('/:id', middlewares_1.default.hasValidBearerToken, multerConfig_1.default.single('image'), (req, res, next) => {
    void (0, collectionController_1.editCollection)(req, res).catch(next);
});
router.delete('/:id', middlewares_1.default.hasValidBearerToken, (req, res, next) => {
    void (0, collectionController_1.deleteCollection)(req, res).catch(next);
});
exports.default = router;
