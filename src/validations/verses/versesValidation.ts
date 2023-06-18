import Joi from 'joi';

const versesSchema: Joi.ObjectSchema = Joi.object({
  bibleId: Joi.string().required().messages({
    'string.empty': 'Bible ID is required',
  }),
  chapterId: Joi.string().required().messages({
    'string.empty': 'Chapter ID is required',
  }),
});

export default versesSchema;