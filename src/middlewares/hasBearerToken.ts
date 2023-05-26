import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../helpers/statusCode';
import { UnauthorizedExceptions } from '../exceptions/clientException';

const hasBearerToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.headers['api-key'];
    if (token) {
        next();
    } else {
        throw new UnauthorizedExceptions('Unauthorized, please provide a valid token.');
    }
};

export default hasBearerToken;