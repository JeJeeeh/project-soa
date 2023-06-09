import { Request, Response } from 'express';
import { Collection, PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCode } from '../helpers/statusCode';
import { IBodyCollection, IDataCollection, IUpdateCollection } from '../interfaces/collectionInterfaces';
import Joi, { ObjectSchema, ValidationError } from 'joi';
import { JoiExceptions } from '../exceptions/joiException';
import { BadRequestExceptions, NotFoundExceptions, TooManyRequestsExceptions } from '../exceptions/clientException';
import { IJwtPayload } from '../interfaces/jwtInterface';
import { writeFile } from 'fs';
import path from 'path';

async function getUser(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    return user;
}

async function countCollection(id: number): Promise<number> {
    const count = await prisma.collection.count({
        where: {
            userId: id,
        },
    });

    return count;
}

async function insertCollection(collection: IDataCollection): Promise<Collection | null> {
    const result = await prisma.collection.create({
        data: collection,
    });

    return result;
}

async function findSingleCollection(id: number): Promise<Collection | null> {
    const result = await prisma.collection.findUnique({
        where: {
            id,
        },
    });

    return result;
}

async function getCollections(userId: number) {
    const result = await prisma.collection.findMany({
        where: {
            userId,
        },
    });

    return result;
}

async function updateCollection(c: IUpdateCollection) {
    const result = await prisma.collection.update({
        where: {
            id: c.id,
        },
        data: {
            name: c.name,
            description: c.description,
        },
    });

    return result;
}

async function doDeleteCollection(id: number) {
    const result = await prisma.collection.delete({
        where: {
            id,
        },
    });

    return result;
}

export const addCollection = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const body = req.body as IBodyCollection;

    const { fileTypeFromBuffer } = await (eval('import("file-type")') as Promise<typeof import('file-type')>);

    const schema: ObjectSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional().allow('', null),
        image: Joi.any(),
    });

    try {
        await schema.validateAsync(body);
    } catch (err) {
        const error = err as ValidationError;
        throw new JoiExceptions(error);
    }

    const checkUser = await getUser((res.locals.user as IJwtPayload).id);
    if (!checkUser) {
        throw new NotFoundExceptions('User not found');
    }

    const collectionCount = await countCollection(checkUser.id);
    if (checkUser.role_id === 1) {
        if (collectionCount > 0) {
            throw new TooManyRequestsExceptions('You have reached the maximum collection limit');
        }
    } else if (checkUser.role_id === 2) {
        if (collectionCount > 10) {
            throw new TooManyRequestsExceptions('You have reached the maximum collection limit');
        }
    }

    const newCollection: IDataCollection = {
        name: body.name,
        description: body.description,
        userId: checkUser.id,
    };

    const collection = await insertCollection(newCollection);

    let imagePath: string | null = null;

    if (req.file) {
        const fileInfo = await fileTypeFromBuffer(req.file.buffer);

        if (fileInfo) {
            if (fileInfo.mime !== 'image/jpeg' && fileInfo.mime !== 'image/png') {
                throw new BadRequestExceptions('Invalid file type, only JPEG and PNG are allowed!');
            }

            const uniqueSuffix = `${ Date.now() }-${ Math.round(Math.random() * 1E9) }`;
            const extname = path.extname(req.file.originalname);

            imagePath = `/uploads/${ req.file.fieldname + '-' + uniqueSuffix + extname }`;

            writeFile(`.${ imagePath }`, req.file.buffer, () => {
                console.log('File uploaded successfully!');
                void prisma.collection.update({
                    where: {
                        id: collection?.id,
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

    res.status(StatusCode.CREATED).json({
        message: 'Success add collection',
        data: {
            id: collection?.id,
            name: collection?.name,
            // eslint-disable-next-line camelcase
            image_path: imagePath ? `${ process.env.HOST_URL as string }${ imagePath }` : null,
            description: collection?.description,
        },
    });

    return;
};

export const getSingleCollection = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const id = Number(req.params.id);

    const schema: ObjectSchema = Joi.object({
        id: Joi.number().required(),
    });

    try {
        await schema.validateAsync({ id });
    } catch (err) {
        const error = err as ValidationError;
        throw new JoiExceptions(error);
    }

    const collection = await findSingleCollection(id);

    if (!collection) {
        throw new NotFoundExceptions('Collection not found');
    }

    if (collection.userId !== (res.locals.user as IJwtPayload).id) {
        throw new BadRequestExceptions('Collection is not yours!!');
    }

    res.status(StatusCode.OK).json({
        message: 'Success get collection',
        data: {
            ...collection,
            // eslint-disable-next-line camelcase
            image_url: collection.image_url ? `${ process.env.HOST_URL as string }${ collection.image_url }` : null,
        },
    });
};

export const getAllCollection = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const collections = await getCollections((res.locals.user as IJwtPayload).id);

    if (!collections) {
        throw new NotFoundExceptions('Collection not found');
    }

    const resCollections = collections.length === 0 ? "No Collections" : collections.map((collection) => {
        return {
            ...collection,
            // eslint-disable-next-line camelcase
            image_url: collection.image_url ? `${ process.env.HOST_URL as string }${ collection.image_url }` : null,
        };
    });
    
    res.status(StatusCode.OK).json(
        {
            message: 'Success get collection',
            data: resCollections,
        },
    );
    return;
};

export const editCollection = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const id = Number(req.params.id);
    const body = req.body as IBodyCollection;

    const { fileTypeFromBuffer } = await (eval('import("file-type")') as Promise<typeof import('file-type')>);

    const regexQuery = new RegExp(/^[^:].*$/);
    const schema: ObjectSchema = Joi.object({
        name: Joi.string().pattern(regexQuery).required(),
        description: Joi.string().optional().allow('', null),
        id: Joi.number().required(),
    });

    try {
        await schema.validateAsync({
            ...body,
            id,
        });
    } catch (err) {
        const error = err as ValidationError;
        throw new JoiExceptions(error);
    }

    const collection = await findSingleCollection(id);

    if (!collection) {
        throw new NotFoundExceptions('Collection not found');
    }

    if (collection.userId !== (res.locals.user as IJwtPayload).id) {
        throw new BadRequestExceptions('Collection is not yours!!');
    }

    const c: IUpdateCollection = {
        id: collection.id,
        name: body.name,
        description: body.description,
    };

    const result = await updateCollection(c);
    let imagePath: string | null = null;

    if (req.file) {
        const fileInfo = await fileTypeFromBuffer(req.file.buffer);

        if (fileInfo) {
            if (fileInfo.mime !== 'image/jpeg' && fileInfo.mime !== 'image/png') {
                throw new BadRequestExceptions('Invalid file type, only JPEG and PNG are allowed!');
            }

            const uniqueSuffix = `${ Date.now() }-${ Math.round(Math.random() * 1E9) }`;
            const extname = path.extname(req.file.originalname);

            imagePath = `/uploads/${ req.file.fieldname + '-' + uniqueSuffix + extname }`;

            writeFile(`.${ imagePath }`, req.file.buffer, () => {
                console.log('File uploaded successfully!');
                void prisma.collection.update({
                    where: {
                        id: collection?.id,
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

    res.status(StatusCode.OK).json({
        message: 'Success update collection',
        data: {
            ...result,
            // eslint-disable-next-line camelcase
            image_url: imagePath ? `${ process.env.HOST_URL as string }${ imagePath }` : null,
        },
    });
};

export const deleteCollection = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const id = Number(req.params.id);

    const schema: ObjectSchema = Joi.object({
        id: Joi.number().required(),
    });

    try {
        await schema.validateAsync({ id });
    } catch (err) {
        const error = err as ValidationError;
        throw new JoiExceptions(error);
    }

    const collection = await findSingleCollection(id);

    if (!collection) {
        throw new NotFoundExceptions('Collection not found');
    }

    if (collection.userId !== (res.locals.user as IJwtPayload).id) {
        throw new BadRequestExceptions('Collection is not yours!!');
    }

    try {
        await doDeleteCollection(collection.id);
        res.status(StatusCode.OK).json({
            message: 'Success delete collection',
        });
    } catch (err) {
        throw new Error('Failed delete collection');
    }
};
