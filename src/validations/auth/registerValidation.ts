import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const uniqueUsername = async (username: string) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });
  } catch (error) {
    throw new Error('Something went wrong when checking for username');
  } finally {
    await prisma.$disconnect();
  }

  if (user) {
    throw new Error('Username already exists');
  }
};

const registerSchema: Joi.ObjectSchema = Joi.object({
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

export default registerSchema;

