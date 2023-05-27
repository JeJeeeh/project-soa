import { Request, Response, NextFunction } from 'express';
import { ForbiddenExceptions, UnauthorizedExceptions } from '../exceptions/clientException';
import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

const hasValidRefreshToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.cookies[ 'refresh-token' ] as string;

    if (!token) {
        throw new UnauthorizedExceptions('Unauthorized');
    }



    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, (err, decoded) => {
        if (err) {
            throw new ForbiddenExceptions('Forbidden');
        }
        res.locals.user = decoded;
    });

    next();
};

// const checkRefreshToken = (token: string): boolean => {
//     try {
//         user = await prisma.user.findFirst({
//             where: {
//                 OR: [
//                     {
//                         username: username,
//                     },
//                     {
//                         email: email,
//                     },
//                 ],
//             },
//         });
//     } catch (error) {
//         console.log(error);

//     } finally {
//         await prisma.$disconnect();
//     }
// };

export default hasValidRefreshToken;