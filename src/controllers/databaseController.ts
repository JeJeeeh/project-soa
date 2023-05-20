import { Request, Response } from "express";
import { PrismaClient, Role } from '@prisma/client';
import { StatusCode } from "../helpers/statusCode";
const prisma = new PrismaClient();

export const seed = async (req: Request, res: Response): Promise<void> => {
    // parse json from req
    const data = req.body;

    // insert data which is an array into database
    data.map(async (item: any) => {
        const result = await createRole(item);
        console.log(result);
    });

    res.status(StatusCode.OK).json({ 
      status: StatusCode.OK, 
      message: 'Seeded successfully', 
      data: data });
    return ;
};

async function createRole(data: any): Promise<Role | null>{
    try{
        const result = await prisma.role.create({
            data
        });

        return result;
    }catch(error){
        console.log(error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}