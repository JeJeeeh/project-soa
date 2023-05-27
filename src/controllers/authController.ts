/* eslint-disable camelcase */
import { Request, Response } from 'express';
import schema from '../validations/auth';
import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import { StatusCode } from '../helpers/statusCode';
import jwt from 'jsonwebtoken';
import { ValidationError } from 'joi';
import { JoiExceptions } from '../exceptions/joiException';
import { NotFoundExceptions } from '../exceptions/clientException';

interface IRegister {
    username: string;
    email: string;
    name: string;
    password: string;
    password_confirmation: string;
}

interface ILogin {
    username?: string;
    email?: string;
    password: string;
}

interface IUserData {
    username: string;
    email: string;
    name: string;
    password: string;
    role_id: number;
    refresh_token: string;
    api_hits: number;
}

const login = async (req: Request, res: Response): Promise<void> => {
    const credentials: ILogin = req.body as ILogin;

    try {
        await schema.loginSchema.validateAsync(credentials, { abortEarly: false });
    } catch (error) {
        const err = error as ValidationError;
        throw new JoiExceptions(err);
    }

    const user = await checkCredentials(credentials);

    if (!user) {
        throw new NotFoundExceptions('Invalid credentials');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.username);
    if (!refreshToken) {
        throw new Error('Something went wrong');
    }

    const maxAgeValue = Number(process.env.REFRESH_TOKEN_COOKIE_TTL as string) * 60 * 60 * 24 * 1000;

    res
        .cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            // secure: true,
            maxAge: maxAgeValue,
        })
        .status(StatusCode.OK)
        .json({
            message: 'Login successful',
            access_token: accessToken,
        });
    return;
};

const register = async (req: Request, res: Response): Promise<Response> => {
    const user: IRegister = req.body as IRegister;

    try {
        await schema.registerSchema.validateAsync(user, { abortEarly: false });
    } catch (error) {
        const err = error as ValidationError;
        throw new JoiExceptions(err);
    }

    const userData: IUserData = {
        username: user.username,
        email: user.email,
        name: user.name,
        password: user.password,
        role_id: 1,
        refresh_token: '',
        api_hits: 0,
    };

    const result = await createUser(userData);

    if (result) {
        return res.status(StatusCode.CREATED).send({
            message: 'User created successfully',
        });
    }
    else {
        throw new Error('Something went wrong');
    }
};

export { login, register };

async function checkCredentials(data: ILogin): Promise<User | null> {
    const password: string = data.password;
    const username: string = data.username ? data.username : '';
    const email: string = data.email ? data.email : '';

    let user: User[] = [];
    try {
        user = await prisma.user.findMany({
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
    } catch (error) {
        console.log(error);

    } finally {
        await prisma.$disconnect();
    }

    if (!user.length) {
        return null;
    }

    if (await checkPassword(password, user[ 0 ].password) === false) {
        return null;
    }

    return user[ 0 ];
}

async function createUser(data: IUserData): Promise<User | null> {
    const password = data.password;
    const hashedPassword = await hashPassword(password);
    data.password = hashedPassword;

    try {
        const result = await prisma.user.create({
            data,
        });

        return result;
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function checkPassword(inputPassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, userPassword);
}

function generateAccessToken(id: number): string {
    const accessToken = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: process.env.ACCESS_TOKEN_TTL });
    return accessToken;
}

async function generateRefreshToken(username: string): Promise<string | null> {
    const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: process.env.REFRESH_TOKEN_TTL });
    try {
        await prisma.user.update({
            where: {
                username: username,
            },
            data: {
                refresh_token: refreshToken,
            },
        });
        return refreshToken;
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}