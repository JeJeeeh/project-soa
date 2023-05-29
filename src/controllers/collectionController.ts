import { Request, Response } from 'express';
import { Collection, PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCode } from '../helpers/statusCode';
import { IBodyCollection, IDataCollection, IUpdateCollection } from '../interfaces/collectionInterfaces';
import Joi, { ObjectSchema, ValidationError } from 'joi';
import { JoiExceptions } from '../exceptions/joiException';
import { BadRequestExceptions, NotFoundExceptions } from '../exceptions/clientException';

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
	const body: IBodyCollection = {
		name: req.body.name,
		description: req.body.description,
	};

	const schema: ObjectSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional().allow('', null),
	});

	try {
		await schema.validateAsync(body);
	} catch (err) {
		const error = err as ValidationError;
		throw new JoiExceptions(error);
	}

    const checkUser = await getUser(res.locals.user.id);
    if (!checkUser) {
        throw new NotFoundExceptions('User not found');
    }
    
    const collectionCount = await countCollection(checkUser.id);
    if (checkUser.role_id === 1) {
        if (collectionCount > 0) {
            //TODO: change Make Exception
            throw new Error('You have reached the maximum collection limit');
        }
    } else if (checkUser.role_id === 2) {
        if (collectionCount > 10) {
            //TODO: change Make Exception
            throw new Error('You have reached the maximum collection limit');
        }
    }

    const newCollection: IDataCollection = {
        name: body.name,
        description: body.description,
        userId: checkUser.id,
    };

    const collection = await insertCollection(newCollection);

    res.status(StatusCode.CREATED).json({
        message: 'Success add collection',
        data: {
            id: collection?.id,
            name: collection?.name,
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
		await schema.validateAsync( { id } );
	} catch (err) {
		const error = err as ValidationError;
		throw new JoiExceptions(error);
    }
    
    const collection = await findSingleCollection(id);

    if (!collection) {
        throw new NotFoundExceptions('Collection not found');
    }

    if (collection.userId !== res.locals.user.id) {
        throw new BadRequestExceptions('Collection is not yours!!');
    }

    res.status(StatusCode.OK).json({
        message: 'Success get collection',
        data: collection,
    });
};

export const getAllCollection = async (
    req: Request,
    res: Response,
): Promise<void> => {    
    const collections = await getCollections(res.locals.user.id);

    if (!collections) {
        throw new NotFoundExceptions('Collection not found');
    }

    res.status(StatusCode.OK).json({
        message: 'Success get collection',
        data: collections,
    });
};

export const editCollection = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const id = Number(req.params.id);
    const body: IBodyCollection = {
        name: req.body.name,
        description: req.body.description,
    };

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

    if (collection.userId !== res.locals.user.id) {
        throw new BadRequestExceptions('Collection is not yours!!');
    }

    const c : IUpdateCollection = {
        id: collection.id,
        name: body.name,
        description: body.description,
    };
    
    const result = await updateCollection(c);

    res.status(StatusCode.OK).json({
        message: 'Success update collection',
        data: result,
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

    if (collection.userId !== res.locals.user.id) {
        throw new BadRequestExceptions('Collection is not yours!!');
    }

    try {
        await doDeleteCollection(collection.id);
        res.status(StatusCode.OK).json({
            message: 'Success delete collection',
        });
    }catch (err) {
        throw new Error('Failed delete collection');
    }
};
