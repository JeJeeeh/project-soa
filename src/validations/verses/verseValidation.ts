import Joi from 'joi';

const verseSchema: Joi.ObjectSchema = Joi.object({
  bibleId: Joi.string().required().messages({
    'string.empty': 'Bible ID is required',
  }),
  verseId: Joi.string().required().messages({
    'string.empty': 'Verse ID is required',
  }),
  "include-verse-spans": Joi.boolean(),
  "parallels": Joi.string(),
  "use-org-id": Joi.string(),
});

export default verseSchema;