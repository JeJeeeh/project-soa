import Joi from 'joi';

const booksSchema: Joi.ObjectSchema = Joi.object({
  "include-chapters": Joi.boolean(),
  "include-chapters-and-sections": Joi.boolean(),
});

export default booksSchema;