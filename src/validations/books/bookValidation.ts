import Joi from 'joi';

const bookSchema: Joi.ObjectSchema = Joi.object({
  bibleId: Joi.string().required().messages({
    'string.empty': 'Bible ID is required',
  }),
  bookId: Joi.string().required().messages({
    'string.empty': 'Book ID is required',
  }),
  "include-chapters": Joi.boolean(),
});

export default bookSchema;