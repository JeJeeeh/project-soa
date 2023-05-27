import { Request, Response, NextFunction } from 'express';
import { UnauthorizedExceptions } from '../exceptions/clientException';
import jwt from 'jsonwebtoken';

const hasValidBearerToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.headers.authorization || req.headers.Authorization as string;

    if (!token) {
        throw new UnauthorizedExceptions('Unauthorized, please provide a valid token.');
    }
    const accessToken = token.split(' ')[ 1 ];
    if (!accessToken) {
        throw new UnauthorizedExceptions('Unauthorized, please provide a valid token.');
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
        if (err) {
            throw new UnauthorizedExceptions('Unauthorized, please provide a valid token.');
        }
        res.locals.user = decoded;
    });

    next();
};

export default hasValidBearerToken;