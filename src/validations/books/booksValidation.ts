import Joi from 'joi';

const booksSchema: Joi.ObjectSchema = Joi.object({
  bibleId: Joi.string().required().messages({
    'string.empty': 'Bible ID is required',
  }),
  "include-chapters": Joi.boolean(),
  "include-chapters-and-sections": Joi.boolean(),
});

export default booksSchema;