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
exports.getDailyBread = void 0;
const client_1 = require("@prisma/client");
const statusCode_1 = require("../helpers/statusCode");
const axiosConfig_1 = __importDefault(require("../config/axiosConfig"));
const bibleExceptions_1 = require("../exceptions/bibleExceptions");
const prisma = new client_1.PrismaClient();
const getDailyBread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const details = yield getDetails();
    if (!details) {
        throw new bibleExceptions_1.BibleExceptions(statusCode_1.StatusCode.BAD_REQUEST, "Unable to get daily bread");
    }
    const response = yield axiosConfig_1.default.get(`/bibles/${details.bibleId}/verses/${details.verseId}`, {
        params: {
            "content-type": "text",
        }
    });
    const data = response.data.data;
    res.status(statusCode_1.StatusCode.OK).json({
        title: data.reference,
        content: data.content.trim(),
    });
    return;
});
exports.getDailyBread = getDailyBread;
function getDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        const randomId = Math.floor(Math.random() * 6) + 1;
        let result = null;
        try {
            result = yield prisma.dailyBread.findUnique({
                where: {
                    id: randomId
                }
            });
        }
        catch (error) {
            console.log(error);
            return null;
        }
        finally {
            yield prisma.$disconnect();
        }
        return result;
    });
}
