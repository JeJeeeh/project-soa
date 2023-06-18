import Joi from 'joi';

interface IBookSchema {
  booksSchema: Joi.ObjectSchema,
  bookSchema: Joi.ObjectSchema
}

export default IBookSchema;