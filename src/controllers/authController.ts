import { Request, Response } from 'express';

const login = async (req: Request, res: Response): Promise<Response> => {
  // const {username, password}: ILogin = req.body;
  return res.send('Hello World');
};

const register = async (req: Request, res: Response): Promise<Response> => {
  // const {username, email, name, password, password_confirmation}: IRegister = req.body;
  
  

  // try {
  //   await schema.validateAsync(req.body);
  // } catch (error: any) {
  //   return res.status(400).send(error.details[0].message);
  // }
  
  return res.send('Hello World');
};

export { login, register };

// interface ILogin {
//   username: string;
//   password: string;
// }

// interface IRegister {
//   username: string;
//   email: string;
//   name: string;
//   password: string;
//   password_confirmation: string;
// }