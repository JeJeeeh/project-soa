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
exports.reduceApiHits = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const reduceApiHits = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    let apiHits = 0;
    if (user) {
        apiHits = user.api_hits;
    }
    else {
        return false;
    }
    if (apiHits < 1) {
        if (user.last_request && !haveDifferentDays(user.last_request, new Date())) {
            return false;
        }
        else {
            yield refreshApiHits(userId, user.role_id);
            return true;
        }
    }
    else {
        try {
            yield prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    /* eslint-disable */
                    api_hits: apiHits - 1,
                    last_request: new Date(),
                    /* eslint-enable */
                },
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            yield prisma.$disconnect();
        }
    }
    return true;
});
exports.reduceApiHits = reduceApiHits;
const haveDifferentDays = (date1, date2) => {
    return date1.getDate() !== date2.getDate();
};
const refreshApiHits = (userId, roleId) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield prisma.role.findUnique({
        where: {
            id: roleId,
        },
    });
    if (!role)
        return;
    try {
        console.log(role.max_api_hits);
        yield prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                /* eslint-disable */
                api_hits: role.max_api_hits - 1,
                /* eslint-enable */
            },
        });
    }
    catch (error) {
        console.log(error);
    }
    finally {
        yield prisma.$disconnect();
    }
});
