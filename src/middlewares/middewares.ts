import {Express, Request, Response, NextFunction} from 'express';

function BearerToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}