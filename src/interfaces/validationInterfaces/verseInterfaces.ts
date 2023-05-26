import Joi from 'joi';
import { IGetVerse } from '../verseInterfaces';

interface IVerseSchema {
  versesSchema: Joi.ObjectSchema,
  verseSchema: IGetVerse,
}

export default IVerseSchema;