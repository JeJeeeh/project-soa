import {Request, Response, NextFunction} from 'express';

function BearerToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

    const InjectApiKey = (req: Request, res: Response, next: NextFunction) => {
        req.headers['api-key'] = process.env.API_KEY;
        next();
    }

export {
    BearerToken,
    InjectApiKey
}
