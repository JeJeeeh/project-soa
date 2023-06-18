"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injectApiKey = (req, res, next) => {
    req.headers['api-key'] = process.env.API_KEY;
    next();
};
exports.default = injectApiKey;
