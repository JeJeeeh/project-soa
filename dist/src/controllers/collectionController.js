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
exports.deleteCollection = exports.editCollection = exports.getAllCollection = exports.getSingleCollection = exports.addCollection = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const statusCode_1 = require("../helpers/statusCode");
const joi_1 = __importDefault(require("joi"));
const joiException_1 = require("../exceptions/joiException");
const clientException_1 = require("../exceptions/clientException");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    });
}
function countCollection(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield prisma.collection.count({
            where: {
                userId: id,
            },
        });
        return count;
    });
}
function insertCollection(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.collection.create({
            data: collection,
        });
        return result;
    });
}
function findSingleCollection(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.collection.findUnique({
            where: {
                id,
            },
        });
        return result;
    });
}
function getCollections(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.collection.findMany({
            where: {
                userId,
            },
        });
        return result;
    });
}
function updateCollection(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.collection.update({
            where: {
                id: c.id,
            },
            data: {
                name: c.name,
                description: c.description,
            },
        });
        return result;
    });
}
function doDeleteCollection(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.collection.delete({
            where: {
                id,
            },
        });
        return result;
    });
}
const addCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { fileTypeFromBuffer } = yield eval('import("file-type")');
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().optional().allow('', null),
        image: joi_1.default.any(),
    });
    try {
        yield schema.validateAsync(body);
    }
    catch (err) {
        const error = err;
        throw new joiException_1.JoiExceptions(error);
    }
    const checkUser = yield getUser(res.locals.user.id);
    if (!checkUser) {
        throw new clientException_1.NotFoundExceptions('User not found');
    }
    const collectionCount = yield countCollection(checkUser.id);
    if (checkUser.role_id === 1) {
        if (collectionCount > 0) {
            throw new clientException_1.TooManyRequestsExceptions('You have reached the maximum collection limit');
        }
    }
    else if (checkUser.role_id === 2) {
        if (collectionCount > 10) {
            throw new clientException_1.TooManyRequestsExceptions('You have reached the maximum collection limit');
        }
    }
    const newCollection = {
        name: body.name,
        description: body.description,
        userId: checkUser.id,
    };
    const collection = yield insertCollection(newCollection);
    let imagePath = null;
    if (req.file) {
        const fileInfo = yield fileTypeFromBuffer(req.file.buffer);
        if (fileInfo) {
            if (fileInfo.mime !== 'image/jpeg' && fileInfo.mime !== 'image/png') {
                throw new clientException_1.BadRequestExceptions('Invalid file type, only JPEG and PNG are allowed!');
            }
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const extname = path_1.default.extname(req.file.originalname);
            imagePath = `/uploads/${req.file.fieldname + '-' + uniqueSuffix + extname}`;
            (0, fs_1.writeFile)(`.${imagePath}`, req.file.buffer, () => {
                console.log('File uploaded successfully!');
                void prisma.collection.update({
                    where: {
                        id: collection === null || collection === void 0 ? void 0 : collection.id,
                    },
                    data: {
                        // eslint-disable-next-line camelcase
                        image_url: imagePath,
                    },
                }).catch((err) => {
                    console.log(err);
                });
            });
        }
    }
    res.status(statusCode_1.StatusCode.CREATED).json({
        message: 'Success add collection',
        data: {
            id: collection === null || collection === void 0 ? void 0 : collection.id,
            name: collection === null || collection === void 0 ? void 0 : collection.name,
            // eslint-disable-next-line camelcase
            image_path: imagePath ? `${process.env.HOST_URL}${imagePath}` : null,
            description: collection === null || collection === void 0 ? void 0 : collection.description,
        },
    });
    return;
});
exports.addCollection = addCollection;
const getSingleCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const schema = joi_1.default.object({
        id: joi_1.default.number().required(),
    });
    try {
        yield schema.validateAsync({ id });
    }
    catch (err) {
        const error = err;
        throw new joiException_1.JoiExceptions(error);
    }
    const collection = yield findSingleCollection(id);
    if (!collection) {
        throw new clientException_1.NotFoundExceptions('Collection not found');
    }
    if (collection.userId !== res.locals.user.id) {
        throw new clientException_1.BadRequestExceptions('Collection is not yours!!');
    }
    res.status(statusCode_1.StatusCode.OK).json({
        message: 'Success get collection',
        data: Object.assign(Object.assign({}, collection), { 
            // eslint-disable-next-line camelcase
            image_url: collection.image_url ? `${process.env.HOST_URL}${collection.image_url}` : null }),
    });
});
exports.getSingleCollection = getSingleCollection;
const getAllCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield getCollections(res.locals.user.id);
    if (!collections) {
        throw new clientException_1.NotFoundExceptions('Collection not found');
    }
    res.status(statusCode_1.StatusCode.OK).json({
        message: 'Success get collection',
        data: collections.map((collection) => {
            return Object.assign(Object.assign({}, collection), { 
                // eslint-disable-next-line camelcase
                image_url: collection.image_url ? `${process.env.HOST_URL}${collection.image_url}` : null });
        }),
    });
});
exports.getAllCollection = getAllCollection;
const editCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const body = req.body;
    const { fileTypeFromBuffer } = yield eval('import("file-type")');
    const regexQuery = new RegExp(/^[^:].*$/);
    const schema = joi_1.default.object({
        name: joi_1.default.string().pattern(regexQuery).required(),
        description: joi_1.default.string().optional().allow('', null),
        id: joi_1.default.number().required(),
    });
    try {
        yield schema.validateAsync(Object.assign(Object.assign({}, body), { id }));
    }
    catch (err) {
        const error = err;
        throw new joiException_1.JoiExceptions(error);
    }
    const collection = yield findSingleCollection(id);
    if (!collection) {
        throw new clientException_1.NotFoundExceptions('Collection not found');
    }
    if (collection.userId !== res.locals.user.id) {
        throw new clientException_1.BadRequestExceptions('Collection is not yours!!');
    }
    const c = {
        id: collection.id,
        name: body.name,
        description: body.description,
    };
    const result = yield updateCollection(c);
    let imagePath = null;
    if (req.file) {
        const fileInfo = yield fileTypeFromBuffer(req.file.buffer);
        if (fileInfo) {
            if (fileInfo.mime !== 'image/jpeg' && fileInfo.mime !== 'image/png') {
                throw new clientException_1.BadRequestExceptions('Invalid file type, only JPEG and PNG are allowed!');
            }
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const extname = path_1.default.extname(req.file.originalname);
            imagePath = `/uploads/${req.file.fieldname + '-' + uniqueSuffix + extname}`;
            (0, fs_1.writeFile)(`.${imagePath}`, req.file.buffer, () => {
                console.log('File uploaded successfully!');
                void prisma.collection.update({
                    where: {
                        id: collection === null || collection === void 0 ? void 0 : collection.id,
                    },
                    data: {
                        // eslint-disable-next-line camelcase
                        image_url: imagePath,
                    },
                }).catch((err) => {
                    console.log(err);
                });
            });
        }
    }
    res.status(statusCode_1.StatusCode.OK).json({
        message: 'Success update collection',
        data: Object.assign(Object.assign({}, result), { 
            // eslint-disable-next-line camelcase
            image_url: imagePath ? `${process.env.HOST_URL}${imagePath}` : null }),
    });
});
exports.editCollection = editCollection;
const deleteCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const schema = joi_1.default.object({
        id: joi_1.default.number().required(),
    });
    try {
        yield schema.validateAsync({ id });
    }
    catch (err) {
        const error = err;
        throw new joiException_1.JoiExceptions(error);
    }
    const collection = yield findSingleCollection(id);
    if (!collection) {
        throw new clientException_1.NotFoundExceptions('Collection not found');
    }
    if (collection.userId !== res.locals.user.id) {
        throw new clientException_1.BadRequestExceptions('Collection is not yours!!');
    }
    try {
        yield doDeleteCollection(collection.id);
        res.status(statusCode_1.StatusCode.OK).json({
            message: 'Success delete collection',
        });
    }
    catch (err) {
        throw new Error('Failed delete collection');
    }
});
exports.deleteCollection = deleteCollection;
