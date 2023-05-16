import { Request, Response } from 'express';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const login = async (req: Request, res: Response): Promise<Response> => {
  // const {username, password}: ILogin = req.body;
  return res.send('Hello World');
};

const register = async (req: Request, res: Response): Promise<Response> => {
  // const {username, email, name, password, password_confirmation}: IRegister = req.body;
  
  const schema = Joi.object({
    username: Joi.string().min(3).required().external(uniqueUsername).messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email',
    }),
    name: Joi.string().min(3).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters long',
    }),
    password: Joi.string().min(8).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
    }),
    password_confirmation: Joi.string().valid(Joi.ref('password')).required().messages({
      'string.empty': 'Password confirmation is required',
      'any.only': 'Password confirmation must match password',
    }),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (error: any) {
    return res.status(400).send(error.details[0].message);
  }
  
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

const uniqueUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  });

  if (user) {
    throw new Error('Username already exists');
  }
};