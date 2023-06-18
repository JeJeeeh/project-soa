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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDailyBread = exports.seed = void 0;
const client_1 = require("@prisma/client");
const statusCode_1 = require("../helpers/statusCode");
const prisma = new client_1.PrismaClient();
const seed = (req, res) => {
    const data = req.body;
    data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield createRole(item);
        console.log(result);
    }));
    res.status(statusCode_1.StatusCode.OK).json({
        status: statusCode_1.StatusCode.OK,
        message: 'Seeded successfully',
        data: data,
    });
    return;
};
exports.seed = seed;
const seedDailyBread = (req, res) => {
    const data = req.body;
    data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield createDailyBread(item);
        console.log(result);
    }));
    res.status(statusCode_1.StatusCode.OK).json({
        status: statusCode_1.StatusCode.OK,
        message: 'Seeded successfully',
        data: data,
    });
};
exports.seedDailyBread = seedDailyBread;
function createRole(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.role.create({
                data,
            });
            return result;
        }
        catch (error) {
            console.log(error);
            return null;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
function createDailyBread(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.dailyBread.create({
                data,
            });
            return result;
        }
        catch (error) {
            console.log(error);
            return null;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
