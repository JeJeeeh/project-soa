import Joi from 'joi';

const bookSchema: Joi.ObjectSchema = Joi.object({
  "include-chapters": Joi.boolean(),
});

export default bookSchema;