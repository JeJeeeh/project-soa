import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { IBookData, IBooks } from '../interfaces/bookInterfaces';
import axios from '../config/axiosConfig';
import { StatusCode } from '../helpers/statusCode';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
    const {bibleId} = req.params;

    const booksResponse: AxiosResponse<IBooks> = await axios.get(`/bibles/${bibleId}/books`);
    const books: IBookData[] = booksResponse.data.data;

    res.status(StatusCode.OK).json(books);
    return;
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
    return;
};