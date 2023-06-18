"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const authController_1 = require("../controllers/authController");
router.post('/login', (req, res, next) => {
    void (0, authController_1.login)(req, res).catch(next);
});
router.post('/register', (req, res, next) => {
    void (0, authController_1.register)(req, res).catch(next);
});
router.get('/refresh-token', (req, res, next) => {
    void (0, authController_1.refreshToken)(req, res).catch(next);
});
router.get('/logout', (req, res, next) => {
    void (0, authController_1.logout)(req, res).catch(next);
});
router.put('/upgrade', (req, res, next) => {
    void (0, authController_1.upgradeAccount)(req, res).catch(next);
});
exports.default = router;
