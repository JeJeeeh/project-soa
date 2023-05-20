import { Request, Response } from 'express';
import schema from '../validations/auth';
import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import { StatusCode } from '../helpers/statusCode';
import jwt from 'jsonwebtoken';

interface IRegister {
  username: string;
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

interface ILogin {
  username?: string;
  email?: string;
  password: string;
}

const login = async (req: Request, res: Response): Promise<void> => {
  const credentials: ILogin = req.body;

  try {
    await schema.loginSchema.validateAsync(credentials, { abortEarly: false });
  } catch (error: any) {
    res.status(StatusCode.BAD_REQUEST).send({
      error: error.message
    });
    return; 
  }

  const user = await checkCredentials(credentials);

  if (!user){
    res.status(StatusCode.NOT_FOUND).send({
      error: 'Invalid credentials'
    });
    return;
  }

  const accessToken = await generateAccessToken(user.username);
  const refreshToken = await generateRefreshToken(user.username);
  if (!refreshToken){
    res.status(StatusCode.INTERNAL_SERVER).send({
      error: 'Something went wrong'
    });
    return; 
  }

  res.status(StatusCode.OK).json({
    message: 'Login successful',
    access_token: accessToken,
  })
  return;
};

const register = async (req: Request, res: Response): Promise<Response> => {
  const user: IRegister = req.body;
  
  try {
    await schema.registerSchema.validateAsync(user, { abortEarly: false });
  } catch (error: any) {
    return res.status(400).send({
      error: error.message
    });
  }

  const userData = {
    username: user.username,
    email: user.email,
    name: user.name,
    password: user.password,
    role_id: 1,
    refresh_token: '',
    api_hits: 0,
  };

  const result = await createUser(userData);
  
  if (result){
    return res.status(StatusCode.CREATED).send({
      message: 'User created successfully',
    });
  }
  else {
    return res.status(500).send('Something went wrong');
  }
};

export { login, register };

async function checkCredentials(data: any): Promise<User | null>{
  const password = data.password;
  const username = data.username? data.username : '';
  const email = data.email? data.email : '';

  let user;
  try {
    user = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: username
          },
          {
            email: email
          }
        ]
      }
    });
  } catch (error) {
    console.log(error);
    
  } finally {
    await prisma.$disconnect();
  }

  if (!user || await checkPassword(password, user[0].password) === false) {
    return null;
  }

  return user[0];
}

async function createUser(data: any): Promise<User | null>{
  const password = data.password;
  const hashedPassword = await hashPassword(password);
  data.password = hashedPassword;

  try{
    const result = await prisma.user.create({
      data
    });

    return result;
  }catch(error){
    console.log(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function checkPassword(inputPassword: string, userPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, userPassword);
}

async function generateAccessToken(username: string): Promise<string>{
  const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: process.env.ACCESS_TOKEN_TTL });
  return accessToken;
}

async function generateRefreshToken(username: string): Promise<string | null>{
  
  const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: process.env.REFRESH_TOKEN_TTL });
  try{
    await prisma.user.update({
      where: {
        username: username
      },
      data: {
        refresh_token: refreshToken
      }
    });
    return refreshToken;
  }catch(error){
    console.log(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}