import Joi from 'joi';

const loginSchema: Joi.ObjectSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
  }),
}).xor('username', 'email')
.messages({
  'object.missing': 'Username or email is required',
  'object.xor': 'Only one of username or email is required',
})
.with('username', 'password')
.with('email', 'password');

export default loginSchema;

