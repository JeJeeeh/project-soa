import { Request, Response } from 'express';
import axios from '../config/axiosConfig';
import { AxiosResponse } from 'axios';
import { StatusCode } from '../helpers/statusCode';
import { IQueryVerse, IVerse, IVerseData, IVerses, IVersesData } from '../interfaces/verseInterfaces';
import schema from '../validations/verses'
import { sanitizeNullObject } from '../helpers/sanitizer';
import { ValidationError } from 'joi';
import { JoiExceptions } from '../exceptions/joiException';

const getVerses = async (req: Request, res: Response): Promise<void> => {
  const { bibleId, chapterId } = req.params;

  const verseResponse: AxiosResponse<IVerses> = await axios.get(`/bibles/${ bibleId }/chapters/${ chapterId }/verses`);
  const verses: IVersesData[] = verseResponse.data.data;

  res.status(StatusCode.OK).json(verses);
  return;
};

const getVerse = async (req: Request, res: Response): Promise<void> => {
  const q: IQueryVerse = req.query;

  const { bibleId, verseId } = req.params;

  try {
    await schema.verseSchema.verseParamsSchema.validateAsync(req.params);
    await schema.verseSchema.verseQueryScehma.validateAsync(q);
  }
  catch (err) {
    const error = err as ValidationError;
    throw new JoiExceptions(error);
  }

  const filteredQ = sanitizeNullObject(q);

  const verseResponse: AxiosResponse<IVerse> = await axios.get(`/bibles/${ bibleId }/verses/${ verseId }`, {
    params: filteredQ
  });
  const verse: IVerseData = verseResponse.data.data;

  res.status(StatusCode.OK).json(verse);
  return;
};

export { getVerses, getVerse };