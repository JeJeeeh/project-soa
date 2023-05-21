import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../helpers/statusCode';

const hasBearerToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.headers.authorization;
    if (token) {
        next();
    } else {
        return res.status(StatusCode.UNAUTHORIZED).send('Unauthorized');
    }
};

export default hasBearerToken;