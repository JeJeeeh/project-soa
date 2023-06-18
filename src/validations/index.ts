import authSchema from './auth';
import IAuthSchema from '../interfaces/validationInterfaces/authInterfaces';

interface IValidations {
  authSchema: IAuthSchema
}

const schema: IValidations = {
  authSchema
};

export default schema;