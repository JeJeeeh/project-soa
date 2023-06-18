import versesSchema from './versesValidation';
import verseSchema from './verseValidation';
import IVerseSchema from '../../interfaces/validationInterfaces/verseInterfaces';

const schema: IVerseSchema = {
  versesSchema,
  verseSchema
};

export default schema;