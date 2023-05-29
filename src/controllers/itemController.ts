import { Request, Response } from 'express';
import { IBodyItem, IDataItem, IItem, IItemsParams } from '../interfaces/itemInterfaces';
import { IJwtPayload } from '../interfaces/jwtInterface';
import { Subcollection, PrismaClient } from '@prisma/client';
import { StatusCode } from '../helpers/statusCode';
import Joi, { ObjectSchema } from 'joi';
import { BadRequestExceptions, ForbiddenExceptions, NotFoundExceptions } from '../exceptions/clientException';
import { AxiosResponse } from 'axios';
import { IVerse, IVerseData } from '../interfaces/verseInterfaces';
import axios from '../config/axiosConfig';
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

    const items = await getAllItems(Number(params.collectionId)) as IItem[];

    const newItems: IItem[] = items.map((item) => {
        delete item.collectionId;
        delete item.createdAt;
        delete item.updatedAt;
        return item;
    });

    res.status(StatusCode.OK).json({
        message: 'Success get items',
        data: newItems,
    });
    return;
};

export const addItem = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as IBodyItem;
    const user = res.locals.user as IJwtPayload;
    const params = req.params as IItemsParams;

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

    const verseResponse: AxiosResponse<IVerse> = await axios.get(`/bibles/${ body.bibleId }/verses/${ body.verseId }`, {
        params: {
            'content-type': 'text',
            'include-notes': true,
            'include-titles': true,
        },
    });

    const verse: IVerseData = verseResponse.data.data;

    const itemData: IDataItem = {
        collectionId: Number(params.collectionId),
        bibleId: body.bibleId,
        verseId: body.verseId,
        bookId: verse.bookId,
        chapterId: verse.chapterId,
        content: verse.content,
        title: verse.reference,
    };

    const item = await prisma.subcollection.create({
        data: itemData,
    }) as IItem;

    delete item.collectionId;
    delete item.createdAt;
    delete item.updatedAt;

    res.status(StatusCode.CREATED).json({
        message: 'Success add item',
        data: item,
    });
    return;
};

export const getSingleItem = async (req: Request, res: Response): Promise<void> => {
    const params = req.params as IItemsParams;
    const user = res.locals.user as IJwtPayload;

    const regexQuery = new RegExp(/^[^:].*$/);
    const schema: ObjectSchema = Joi.object({
        collectionId: Joi.string().pattern(regexQuery).required(),
        itemId: Joi.string().pattern(regexQuery).required(),
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

    const item = await prisma.subcollection.findUnique({
        where: {
            id: Number(params.itemId),
        },
    }) as IItem;

    if (!item) {
        throw new NotFoundExceptions('Item not found!');
    }

    delete item.collectionId;
    delete item.createdAt;
    delete item.updatedAt;

    res.status(StatusCode.OK).json({
        message: 'Success get item',
        data: item,
    });

};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    const params = req.params as IItemsParams;
    const user = res.locals.user as IJwtPayload;

    const regexQuery = new RegExp(/^[^:].*$/);
    const schema: ObjectSchema = Joi.object({
        collectionId: Joi.string().pattern(regexQuery).required(),
        itemId: Joi.string().pattern(regexQuery).required(),
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

    try {
        await prisma.subcollection.delete({
            where: {
                id: Number(params.itemId),
            },
        });
    } catch (error) {
        throw new BadRequestExceptions('Invalid item id');
    }

    res.status(StatusCode.OK).json({
        message: 'Success delete item',
    });
};