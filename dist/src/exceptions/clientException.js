"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsExceptions = exports.UnauthorizedExceptions = exports.ForbiddenExceptions = exports.NotFoundExceptions = exports.BadRequestExceptions = void 0;
class BadRequestExceptions extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestExceptions';
    }
}
exports.BadRequestExceptions = BadRequestExceptions;
class NotFoundExceptions extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundExceptions';
    }
}
exports.NotFoundExceptions = NotFoundExceptions;
class ForbiddenExceptions extends Error {
    constructor(message) {
        super(message);
        this.name = 'ForbiddenExceptions';
    }
}
exports.ForbiddenExceptions = ForbiddenExceptions;
class UnauthorizedExceptions extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedExceptions';
    }
}
exports.UnauthorizedExceptions = UnauthorizedExceptions;
class TooManyRequestsExceptions extends Error {
    constructor(message) {
        super(message);
        this.name = 'TooManyRequestsExceptions';
    }
}
exports.TooManyRequestsExceptions = TooManyRequestsExceptions;
