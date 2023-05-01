import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../helpers/statusCode';

const bearerToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.headers.authorization;
    if (token) {
        next();
    } else {
        return res.status(StatusCode.UNAUTHORIZED).send('Unauthorized');
    }
};

const injectApiKey = (req: Request, res: Response, next: NextFunction): void => {
    req.headers[ 'api-key' ] = process.env.API_KEY;
    next();
};

export {
    bearerToken,
    injectApiKey,
};
