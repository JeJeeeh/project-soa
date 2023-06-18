import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { BadRequestExceptions } from '../../exceptions/clientException';
const prisma = new PrismaClient();

const uniqueUsername = async (username: string) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  } catch (error) {
    throw new BadRequestExceptions('Something went wrong when checking for username');
  } finally {
    await prisma.$disconnect();
  }

  if (user) {
    throw new BadRequestExceptions('Username already exists');
  }
};

const uniqueEmail = async (email: string) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  } catch (error) {
    throw new BadRequestExceptions('Something went wrong when checking for email');
  } finally {
    await prisma.$disconnect();
  }

  if (user) {
    throw new BadRequestExceptions('Email already exists');
  }
};

const registerSchema: Joi.ObjectSchema = Joi.object({
  username: Joi.string().min(3).required().external(uniqueUsername).label('Username').messages({
    'string.empty': '{{#label}} is required',
    'string.min': '{{#label}} must be at least 3 characters long',
  }),
  email: Joi.string().email().required().external(uniqueEmail).label('Email').messages({
    'string.empty': '{{#label}} is required',
    'string.email': '{{#label}} must be a valid email',
  }),
  name: Joi.string().min(3).required().label('Name').messages({
    'string.empty': '{{#label}} is required',
    'string.min': '{{#label}} must be at least 3 characters long',
  }),
  password: Joi.string().min(8).required().label('Password').messages({
    'string.empty': '{{#label}} is required',
    'string.min': '{{#label}} must be at least 8 characters long',
  }),
  // eslint-disable-next-line camelcase
  password_confirmation: Joi.string().valid(Joi.ref('password')).label('Password Confirmation').required().messages({
    'string.empty': '{{#label}} is required',
    'any.only': '{{#label}} must match password',
  }),
});

export default registerSchema;

