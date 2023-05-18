import Joi from 'joi';

interface IAuthSchema {
  registerSchema: Joi.ObjectSchema,
  loginSchema: Joi.ObjectSchema
}

export default IAuthSchema;