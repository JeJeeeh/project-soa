import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UnauthorizedExceptions } from "../exceptions/clientException";
import { IJwtPayload } from "../interfaces/jwtInterface";


const hasDailyBread = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization || req.headers.Authorization as string;
  const accessToken = token.split(' ')[ 1 ];
  let role_id: number = 1;
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
        throw new UnauthorizedExceptions('Unauthorized, please provide a valid token.');
    }
    const payload = decoded as IJwtPayload;
    role_id = payload.role_id;
  });

  if (role_id === 1){
    throw new UnauthorizedExceptions('Unauthorized, upgrade to access daily bread.');
  } 
  next();
  return;
};

export default hasDailyBread;