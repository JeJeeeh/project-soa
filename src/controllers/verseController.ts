import { Request, Response } from 'express';
import axios from '../config/axiosConfig';
import { AxiosResponse } from 'axios';
import { StatusCode } from '../helpers/statusCode';

interface IVerses {
  data: IVerseData[];
}

interface IVerse {
  data: IVerseData;
}

interface IVerseData {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
}

const getVerses = async (req: Request, res: Response): Promise<Response> => {
  return res.send('Hello World');
};

const getVerse = (req: Request, res: Response) => {
  res.send('Hello World');
};

export { getVerses, getVerse };