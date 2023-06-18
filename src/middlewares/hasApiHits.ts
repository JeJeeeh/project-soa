import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedExceptions } from '../exceptions/clientException';
import { IJwtPayload } from '../interfaces/jwtInterface';
import { reduceApiHits } from '../helpers/reduceApiHits';

const hasApiHits = async (req: Request, res: Response, next: NextFunction): Promise<boolean> => {
  const token = req.headers.authorization || req.headers.Authorization as string;
  const accessToken = token.split(' ')[ 1 ];
  let userId = 0;
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
        throw new UnauthorizedExceptions('Unauthorized, please provide a valid token.');
    }
    const payload = decoded as IJwtPayload;
    userId = payload.id;
  });

  try {
    const valid = await reduceApiHits(userId);
    if (!valid){
      throw new UnauthorizedExceptions('You have reached your daily limit.');
    }
    next();

    return true;
  } catch (error) {
    next(error);
  }

  return true;
};

export default hasApiHits;