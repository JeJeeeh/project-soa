"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientException_1 = require("../exceptions/clientException");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hasValidBearerToken = (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token) {
        throw new clientException_1.UnauthorizedExceptions('Unauthorized, please provide a valid token.');
    }
    const accessToken = token.split(' ')[1];
    if (!accessToken) {
        throw new clientException_1.UnauthorizedExceptions('Unauthorized, please provide a valid token.');
    }
    jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            throw new clientException_1.UnauthorizedExceptions('Unauthorized, please provide a valid token.');
        }
        res.locals.user = decoded;
    });
    next();
};
exports.default = hasValidBearerToken;
