import Joi from 'joi';
import { ContentType } from '../../helpers/contentType';
import { IGetVerse } from '../../interfaces/verseInterfaces';

const verseParamsSchema: Joi.ObjectSchema = Joi.object({
  bibleId: Joi.string().required().messages({
    'string.empty': 'Bible ID is required',
  }),
  verseId: Joi.string().required().messages({
    'string.empty': 'Verse ID is required',
  }),
});

const verseQueryScehma: Joi.ObjectSchema = Joi.object({
  "content-type": Joi.string().optional().valid(ContentType.JSON, ContentType.HTML, ContentType.TEXT).messages({
    'string.valid': 'Content type must be one of the following: json, html, text',
  }),
  "include-notes": Joi.boolean().optional().messages({
    'boolean.base': 'Include notes must be a boolean',
  }),
  "include-titles": Joi.boolean().optional().messages({
    'boolean.base': 'Include titles must be a boolean',
  }),
  "include-chapter-numbers": Joi.boolean().optional().messages({
    'boolean.base': 'Include chapter numbers must be a boolean',
  }),
  "include-verse-numbers": Joi.boolean().optional().messages({
    'boolean.base': 'Include verse numbers must be a boolean',
  }),
  "include-verse-spans": Joi.boolean().optional().messages({
    'boolean.base': 'Include verse spans must be a boolean',
  }),
  "parallels": Joi.string().optional().messages({
    'string.base': 'Parallels must be a string',
  }),
  "use-org-id": Joi.boolean().optional().messages({
    'boolean.base': 'Use org ID must be a boolean',
  }),
});

const verseSchema: IGetVerse= {
  verseParamsSchema,
  verseQueryScehma,
};
export default verseSchema;