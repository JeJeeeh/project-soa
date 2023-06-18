import Joi from 'joi';
import { ContentType } from '../helpers/contentType';

export interface IVerses {
  data: IVersesData[];
}

export interface IVerse {
  data: IVerseData;
}

export interface IVersesData {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
}

export interface IVerseData {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
  next: {
    id: string;
    bookId: string;
  },
  previous: {
    id: string;
    bookId: string;
  },
}

export interface IQueryVerse {
  'content-type'?: ContentType;
  'include-notes'?: boolean;
  'include-titles'?: boolean;
  'include-chapter-numbers'?: boolean;
  'include-verse-numbers'?: boolean;
  'include-verse-spans'?: boolean;
  'parallels'?: string;
  'use-org-id'?: boolean;
}

export interface IGetVerse {
  verseParamsSchema: Joi.ObjectSchema,
  verseQueryScehma: Joi.ObjectSchema,
}