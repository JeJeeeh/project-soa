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
exports.upgradeAccount = exports.logout = exports.refreshToken = exports.register = exports.login = void 0;
const auth_1 = __importDefault(require("../validations/auth"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcrypt_1 = __importDefault(require("bcrypt"));
const statusCode_1 = require("../helpers/statusCode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joiException_1 = require("../exceptions/joiException");
const clientException_1 = require("../exceptions/clientException");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = req.body;
    try {
        yield auth_1.default.loginSchema.validateAsync(credentials, { abortEarly: false });
    }
    catch (error) {
        const err = error;
        throw new joiException_1.JoiExceptions(err);
    }
    const user = yield checkCredentials(credentials);
    if (!user) {
        throw new clientException_1.NotFoundExceptions('Invalid credentials');
    }
    const accessToken = generateAccessToken(user.id, user.role_id);
    const refreshToken = yield generateRefreshToken(user.username, user.role_id);
    if (!refreshToken) {
        throw new Error('Something went wrong');
    }
    const maxAgeValue = Number(process.env.REFRESH_TOKEN_COOKIE_TTL) * 60 * 60 * 24 * 1000;
    res
        .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        // secure: true,
        maxAge: maxAgeValue,
    })
        .status(statusCode_1.StatusCode.OK)
        .json({
        message: 'Login successful',
        access_token: accessToken,
    });
    return;
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        yield auth_1.default.registerSchema.validateAsync(user, { abortEarly: false });
    }
    catch (error) {
        const err = error;
        throw new joiException_1.JoiExceptions(err);
    }
    const userData = {
        username: user.username,
        email: user.email,
        name: user.name,
        password: user.password,
        role_id: 1,
        refresh_token: '',
        api_hits: 10,
    };
    const result = yield createUser(userData);
    if (result) {
        return res.status(statusCode_1.StatusCode.CREATED).send({
            message: 'User created successfully',
        });
    }
    else {
        throw new Error('Something went wrong');
    }
});
exports.register = register;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    const token = cookies.refresh_token;
    if (!token) {
        throw new clientException_1.UnauthorizedExceptions('Unauthorized');
    }
    let user = null;
    try {
        user = yield getUserByRefreshToken(token);
    }
    catch (error) {
        throw new clientException_1.ForbiddenExceptions('Forbidden');
    }
    if (!user) {
        throw new clientException_1.ForbiddenExceptions('Forbidden');
    }
    try {
        const jwtResult = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const payload = jwtResult;
        if (payload.username !== user.username) {
            throw new clientException_1.ForbiddenExceptions('Forbidden');
        }
        return res.status(statusCode_1.StatusCode.OK).json({
            message: 'Token refreshed successfully',
            access_token: generateAccessToken(user.id, user.role_id),
        });
    }
    catch (error) {
        throw new clientException_1.ForbiddenExceptions('Forbidden');
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    const token = cookies.refresh_token;
    if (!token) {
        return res.status(statusCode_1.StatusCode.NO_CONTENT).json({
            status: statusCode_1.StatusCode.NO_CONTENT,
            message: 'No refresh token found',
        });
    }
    const user = yield getUserByRefreshToken(token);
    if (user) {
        yield removeRefreshToken(token);
    }
    return res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    }).status(statusCode_1.StatusCode.NO_CONTENT).json({
        status: statusCode_1.StatusCode.NO_CONTENT,
        message: 'No refresh token found',
    });
});
exports.logout = logout;
const upgradeAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    const token = cookies.refresh_token;
    if (!token) {
        throw new clientException_1.UnauthorizedExceptions('Unauthorized');
    }
    let user = null;
    try {
        user = yield getUserByRefreshToken(token);
    }
    catch (error) {
        throw new clientException_1.ForbiddenExceptions('Forbidden');
    }
    if (!user) {
        throw new clientException_1.ForbiddenExceptions('Forbidden');
    }
    try {
        const jwtResult = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const payload = jwtResult;
        if (payload.role_id === 1) {
            yield prisma.user.update({
                where: {
                    id: payload.id,
                },
                data: {
                    role_id: 2,
                },
            });
        }
        else {
            throw new clientException_1.ForbiddenExceptions('Forbidden');
        }
        return res.status(statusCode_1.StatusCode.OK).json({
            message: 'Account upgraded successfully',
        });
    }
    catch (error) {
        throw new clientException_1.ForbiddenExceptions('Forbidden');
    }
});
exports.upgradeAccount = upgradeAccount;
function checkCredentials(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = data.password;
        const username = data.username ? data.username : '';
        const email = data.email ? data.email : '';
        let user = [];
        try {
            user = yield prisma.user.findMany({
                where: {
                    OR: [
                        {
                            username: username,
                        },
                        {
                            email: email,
                        },
                    ],
                },
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            yield prisma.$disconnect();
        }
        if (!user.length) {
            return null;
        }
        if ((yield checkPassword(password, user[0].password)) === false) {
            return null;
        }
        return user[0];
    });
}
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = data.password;
        const hashedPassword = yield hashPassword(password);
        data.password = hashedPassword;
        try {
            const result = yield prisma.user.create({
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
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    });
}
function checkPassword(inputPassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(inputPassword, userPassword);
    });
}
function generateAccessToken(id, role_id) {
    const accessToken = jsonwebtoken_1.default.sign({ id: id, role_id: role_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL });
    return accessToken;
}
function generateRefreshToken(username, role_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = jsonwebtoken_1.default.sign({ username: username, role_id: role_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL });
        try {
            yield prisma.user.update({
                where: {
                    username: username,
                },
                data: {
                    refresh_token: refreshToken,
                },
            });
            return refreshToken;
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
const removeRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        refresh_token: refreshToken,
    };
    try {
        yield prisma.user.update({
            where: user,
            data: {
                refresh_token: null,
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
const getUserByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        refresh_token: refreshToken,
    };
    try {
        const resultUser = yield prisma.user.findMany({
            where: user,
        });
        return resultUser[0];
    }
    catch (error) {
        console.log(error);
    }
    finally {
        yield prisma.$disconnect();
    }
    return null;
});
