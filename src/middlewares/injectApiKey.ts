import { Request, Response, NextFunction } from 'express';

const injectApiKey = (req: Request, res: Response, next: NextFunction): void => {
  req.headers[ 'api-key' ] = process.env.API_KEY;
  next();
};

export default injectApiKey;