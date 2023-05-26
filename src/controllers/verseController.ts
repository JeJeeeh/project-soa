import { Request, Response } from 'express';
import axios from '../config/axiosConfig';
import { AxiosResponse } from 'axios';
import { StatusCode } from '../helpers/statusCode';
import { IVerse, IVerseData, IVerses, IVersesData } from '../interfaces/verseInterfaces';

const getVerses = async (req: Request, res: Response): Promise<void> => {
  const { bibleId, chapterId } = req.params;

  const verseResponse: AxiosResponse<IVerses> = await axios.get(`/bibles/${ bibleId }/chapters/${ chapterId }/verses`);
  const verses: IVersesData[] = verseResponse.data.data;

  res.status(StatusCode.OK).json(verses);
  return;
};

const getVerse = async (req: Request, res: Response): Promise<void> => {
  // const q: IQueryVerse = req.query;

  const { bibleId, verseId } = req.params;

  const verseResponse: AxiosResponse<IVerse> = await axios.get(`/bibles/${ bibleId }/verses/${ verseId }`);
  const verse: IVerseData = verseResponse.data.data;

  res.status(StatusCode.OK).json(verse);
  return;
};

export { getVerses, getVerse };