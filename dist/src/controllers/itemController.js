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
exports.deleteItem = exports.getSingleItem = exports.addItem = exports.getItems = void 0;
const client_1 = require("@prisma/client");
const statusCode_1 = require("../helpers/statusCode");
const joi_1 = __importDefault(require("joi"));
const clientException_1 = require("../exceptions/clientException");
const axiosConfig_1 = __importDefault(require("../config/axiosConfig"));
const prisma = new client_1.PrismaClient();
const collectionIdOwner = (collectionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield prisma.collection.findMany({
        where: {
            id: collectionId,
            userId,
        },
    });
    return collection.length > 0;
});
const getAllItems = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield prisma.subcollection.findMany({
        where: {
            collectionId,
        },
    });
    return items;
});
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    const params = req.params;
    const regexQuery = new RegExp(/^[^:].*$/);
    const schema = joi_1.default.object({
        collectionId: joi_1.default.string().pattern(regexQuery).required(),
    });
    try {
        yield schema.validateAsync(params);
    }
    catch (err) {
        throw new clientException_1.BadRequestExceptions('Invalid params');
    }
    const isOwner = yield collectionIdOwner(Number(params.collectionId), user.id);
    if (!isOwner) {
        throw new clientException_1.ForbiddenExceptions('You are not the owner of this collection');
    }
    const items = yield getAllItems(Number(params.collectionId));
    const newItems = items.map((item) => {
        delete item.collectionId;
        delete item.createdAt;
        delete item.updatedAt;
        return item;
    });
    res.status(statusCode_1.StatusCode.OK).json({
        message: 'Success get items',
        data: newItems,
    });
    return;
});
exports.getItems = getItems;
const addItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = res.locals.user;
    const params = req.params;
    const regexQuery = new RegExp(/^[^:].*$/);
    const schema = joi_1.default.object({
        collectionId: joi_1.default.string().pattern(regexQuery).required(),
    });
    try {
        yield schema.validateAsync(params);
    }
    catch (err) {
        throw new clientException_1.BadRequestExceptions('Invalid params');
    }
    const isOwner = yield collectionIdOwner(Number(params.collectionId), user.id);
    if (!isOwner) {
        throw new clientException_1.ForbiddenExceptions('You are not the owner of this collection');
    }
    const verseResponse = yield axiosConfig_1.default.get(`/bibles/${body.bibleId}/verses/${body.verseId}`, {
        params: {
            'content-type': 'text',
            'include-notes': true,
            'include-titles': true,
        },
    });
    const verse = verseResponse.data.data;
    const itemData = {
        collectionId: Number(params.collectionId),
        bibleId: body.bibleId,
        verseId: body.verseId,
        bookId: verse.bookId,
        chapterId: verse.chapterId,
        content: verse.content,
        title: verse.reference,
    };
    const item = yield prisma.subcollection.create({
        data: itemData,
    });
    delete item.collectionId;
    delete item.createdAt;
    delete item.updatedAt;
    res.status(statusCode_1.StatusCode.CREATED).json({
        message: 'Success add item',
        data: item,
    });
    return;
});
exports.addItem = addItem;
const getSingleItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    const user = res.locals.user;
    const regexQuery = new RegExp(/^[^:].*$/);
    const schema = joi_1.default.object({
        collectionId: joi_1.default.string().pattern(regexQuery).required(),
        itemId: joi_1.default.string().pattern(regexQuery).required(),
    });
    try {
        yield schema.validateAsync(params);
    }
    catch (err) {
        throw new clientException_1.BadRequestExceptions('Invalid params');
    }
    const isOwner = yield collectionIdOwner(Number(params.collectionId), user.id);
    if (!isOwner) {
        throw new clientException_1.ForbiddenExceptions('You are not the owner of this collection');
    }
    const item = yield prisma.subcollection.findUnique({
        where: {
            id: Number(params.itemId),
        },
    });
    if (!item) {
        throw new clientException_1.NotFoundExceptions('Item not found!');
    }
    delete item.collectionId;
    delete item.createdAt;
    delete item.updatedAt;
    res.status(statusCode_1.StatusCode.OK).json({
        message: 'Success get item',
        data: item,
    });
});
exports.getSingleItem = getSingleItem;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    const user = res.locals.user;
    const regexQuery = new RegExp(/^[^:].*$/);
    const schema = joi_1.default.object({
        collectionId: joi_1.default.string().pattern(regexQuery).required(),
        itemId: joi_1.default.string().pattern(regexQuery).required(),
    });
    try {
        yield schema.validateAsync(params);
    }
    catch (err) {
        throw new clientException_1.BadRequestExceptions('Invalid params');
    }
    const isOwner = yield collectionIdOwner(Number(params.collectionId), user.id);
    if (!isOwner) {
        throw new clientException_1.ForbiddenExceptions('You are not the owner of this collection');
    }
    try {
        yield prisma.subcollection.delete({
            where: {
                id: Number(params.itemId),
            },
        });
    }
    catch (error) {
        throw new clientException_1.BadRequestExceptions('Invalid item id');
    }
    res.status(statusCode_1.StatusCode.OK).json({
        message: 'Success delete item',
    });
});
exports.deleteItem = deleteItem;
