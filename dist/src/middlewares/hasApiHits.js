"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clientException_1 = require("../exceptions/clientException");
const reduceApiHits_1 = require("../helpers/reduceApiHits");
const hasApiHits = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || req.headers.Authorization;
    const accessToken = token.split(' ')[1];
    let userId = 0;
    jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            throw new clientException_1.UnauthorizedExceptions('Unauthorized, please provide a valid token.');
        }
        const payload = decoded;
        userId = payload.id;
    });
    try {
        const valid = yield (0, reduceApiHits_1.reduceApiHits)(userId);
        if (!valid) {
            throw new clientException_1.UnauthorizedExceptions('You have reached your daily limit.');
        }
        next();
        return true;
    }
    catch (error) {
        next(error);
    }
    return true;
});
exports.default = hasApiHits;
