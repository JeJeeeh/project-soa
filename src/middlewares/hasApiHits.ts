import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UnauthorizedExceptions } from "../exceptions/clientException";
import { IJwtPayload } from "../interfaces/jwtInterface";
import { reduceApiHits } from "../helpers/reduceApiHits";

const hasApiHits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization || req.headers.Authorization as string;
  const accessToken = token.split(' ')[ 1 ];
  let user_id: number = 0;
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
        throw new UnauthorizedExceptions('Unauthorized, please provide a valid token.');
    }
    const payload = decoded as IJwtPayload;
    user_id = payload.id;
  });

  if (user_id === 0){
    throw new UnauthorizedExceptions('Unauthorized, please provide a valid token.');
  }

  try {
    const valid = await reduceApiHits(user_id);
    if (!valid){
      throw new UnauthorizedExceptions('You have reached your daily limit.');
    }
    
    next();
  } catch (error: UnauthorizedExceptions | any) {
    next(error);
  }
  return;
};

export default hasApiHits;