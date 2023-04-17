import { Request, Response } from 'express';

const login = (req: Request, res: Response) => {
  res.send('Hello World');
};

const register = (req: Request, res: Response) => {
  res.send('Hello World');
};

export { login, register };