"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const bibles_1 = __importDefault(require("./src/routes/bibles"));
const bibleExceptions_1 = require("./src/exceptions/bibleExceptions");
const statusCode_1 = require("./src/helpers/statusCode");
const books_1 = __importDefault(require("./src/routes/books"));
const verses_1 = __importDefault(require("./src/routes/verses"));
const chapters_1 = __importDefault(require("./src/routes/chapters"));
const database_1 = __importDefault(require("./src/routes/database"));
const collection_1 = __importDefault(require("./src/routes/collection"));
const item_1 = __importDefault(require("./src/routes/item"));
const clientException_1 = require("./src/exceptions/clientException");
const dailybread_1 = __importDefault(require("./src/routes/dailybread"));
const joiException_1 = require("./src/exceptions/joiException");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const basePrefix = '/api/v1';
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static('uploads'));
app.set('Content-Type', 'application/json');
app.set('x-powered-by', false);
app.use(`${basePrefix}/`, dailybread_1.default);
app.use(`${basePrefix}/auth`, auth_1.default);
app.use(`${basePrefix}/bibles`, bibles_1.default);
app.use(`${basePrefix}/bibles`, books_1.default);
app.use(`${basePrefix}/bibles`, verses_1.default);
app.use(`${basePrefix}/bibles`, chapters_1.default);
app.use(`${basePrefix}/collections`, collection_1.default);
app.use(`${basePrefix}/collections`, item_1.default);
app.use(`${basePrefix}/database`, database_1.default);
app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof bibleExceptions_1.BibleExceptions) {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
        });
        return;
    }
    if (err instanceof joiException_1.JoiExceptions) {
        res.status(statusCode_1.StatusCode.BAD_REQUEST).json({
            status: statusCode_1.StatusCode.BAD_REQUEST,
            message: err.getDetailError(),
        });
        return;
    }
    if (err instanceof clientException_1.BadRequestExceptions) {
        res.status(statusCode_1.StatusCode.BAD_REQUEST).json({
            status: statusCode_1.StatusCode.BAD_REQUEST,
            message: err.message,
        });
        return;
    }
    if (err instanceof clientException_1.NotFoundExceptions) {
        res.status(statusCode_1.StatusCode.NOT_FOUND).json({
            status: statusCode_1.StatusCode.NOT_FOUND,
            message: err.message,
        });
        return;
    }
    if (err instanceof clientException_1.ForbiddenExceptions) {
        res.status(statusCode_1.StatusCode.FORBIDDEN).json({
            status: statusCode_1.StatusCode.FORBIDDEN,
            message: err.message,
        });
        return;
    }
    if (err instanceof clientException_1.UnauthorizedExceptions) {
        res.status(statusCode_1.StatusCode.UNAUTHORIZED).json({
            status: statusCode_1.StatusCode.UNAUTHORIZED,
            message: err.message,
        });
        return;
    }
    if (err instanceof clientException_1.TooManyRequestsExceptions) {
        res.status(statusCode_1.StatusCode.TOO_MANY_REQUESTS).json({
            status: statusCode_1.StatusCode.TOO_MANY_REQUESTS,
            message: err.message,
        });
        return;
    }
    res.status(statusCode_1.StatusCode.INTERNAL_SERVER).json({
        status: statusCode_1.StatusCode.INTERNAL_SERVER,
        message: 'Internal Server Error',
    });
    return;
    next();
});
app.all('*', (req, res) => {
    res.status(statusCode_1.StatusCode.NOT_FOUND).json({
        status: statusCode_1.StatusCode.NOT_FOUND,
        message: 'Are you lost? Read the bible instead.',
    });
    return;
});
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
