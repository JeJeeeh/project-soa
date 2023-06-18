"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeNullObject = void 0;
const sanitizeNullObject = (param) => {
    return Object.fromEntries(Object.entries(param).filter(([, value]) => value));
};
exports.sanitizeNullObject = sanitizeNullObject;
