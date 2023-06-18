"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clientException_1 = require("../exceptions/clientException");
const hasDailyBread = (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization;
    const accessToken = token.split(' ')[1];
    let role_id = 1;
    jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            throw new clientException_1.UnauthorizedExceptions('Unauthorized, please provide a valid token.');
        }
        const payload = decoded;
        role_id = payload.role_id;
    });
    if (role_id === 1) {
        throw new clientException_1.UnauthorizedExceptions('Unauthorized, upgrade to access daily bread.');
    }
    next();
    return;
};
exports.default = hasDailyBread;
