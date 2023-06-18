"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hasValidBearerToken_1 = __importDefault(require("./hasValidBearerToken"));
const injectApiKey_1 = __importDefault(require("./injectApiKey"));
const hasDailyBread_1 = __importDefault(require("./hasDailyBread"));
const hasApiHits_1 = __importDefault(require("./hasApiHits"));
const middlewares = {
    hasValidBearerToken: hasValidBearerToken_1.default,
    injectApiKey: injectApiKey_1.default,
    hasDailyBread: hasDailyBread_1.default,
    hasApiHits: hasApiHits_1.default,
};
exports.default = middlewares;
