"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const databaseController_1 = require("../controllers/databaseController");
const router = (0, express_1.Router)();
router.post('/seed', (req, res) => {
    void (0, databaseController_1.seed)(req, res);
});
router.post('/seeddailybread', (req, res) => {
    void (0, databaseController_1.seedDailyBread)(req, res);
});
exports.default = router;
