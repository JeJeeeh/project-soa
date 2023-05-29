import { Request, Response } from 'express';
import { IItemsParams } from '../interfaces/itemInterfaces';
import { IJwtPayload } from '../interfaces/jwtInterface';
import { Subcollection, PrismaClient } from '@prisma/client';
import { StatusCode } from '../helpers/statusCode';
import Joi, { ObjectSchema } from 'joi';
import { BadRequestExceptions, ForbiddenExceptions } from '../exceptions/clientException';
const prisma = new PrismaClient();

const collectionIdOwner = async (collectionId: number, userId: number): Promise<boolean> => {
    const collection = await prisma.collection.findMany({
        where: {
            id: collectionId,
            userId,
        },
    });

    return collection.length > 0;
};

const getAllItems = async (collectionId: number): Promise<Subcollection[]> => {
    const items = await prisma.subcollection.findMany({
        where: {
            collectionId,
        },
    });

    return items;
};

export const getItems = async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user as IJwtPayload;
    const params: IItemsParams = req.params;

    const regexQuery = new RegExp(/^[^:].*$/);
    const schema: ObjectSchema = Joi.object({
        collectionId: Joi.string().pattern(regexQuery).required(),
    });

    try {
        await schema.validateAsync(params);
    }
    catch (err) {
        throw new BadRequestExceptions('Invalid params');
    }

    const isOwner = await collectionIdOwner(Number(params.collectionId), user.id);

    if (!isOwner) {
        throw new ForbiddenExceptions('You are not the owner of this collection');
    }

    const items = await getAllItems(Number(params.collectionId));

    res.status(StatusCode.OK).json({
        message: 'Success get items',
        data: items,
    });
    return;
};
