"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BibleExceptions = void 0;
class BibleExceptions extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'BibleExceptions';
    }
    toString() {
        return `${this.statusCode}: ${this.message}`;
    }
}
exports.BibleExceptions = BibleExceptions;
