import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { StatusCode } from '../helpers/statusCode';
const prisma = new PrismaClient();


interface IObject {
    name: string;
    max_api_hits: number;
    max_collection: number;
    has_daily_bread: boolean;
}

export const seed = (req: Request, res: Response): void => {
    // parse json from req
    const data = req.body as Array<IObject>;

    // insert data which is an array into database
    data.map(async (item) => {
        const result = await createRole(item);
        console.log(result);
    });

    res.status(StatusCode.OK).json({
        status: StatusCode.OK,
        message: 'Seeded successfully',
        data: data,
    });
    return;
};

async function createRole(data: IObject): Promise<Role | null> {
    try {
        const result = await prisma.role.create({
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