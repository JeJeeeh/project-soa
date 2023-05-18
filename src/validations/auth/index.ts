import registerSchema from './registerValidation';
import loginSchema from './loginValidation';
import IAuthSchema from '../../interfaces/validationInterfaces/authInterfaces';

const schema: IAuthSchema = {
  registerSchema,
  loginSchema
};

export default schema;
