import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { IBook, IBookData, IBooks, IQueryBook } from '../interfaces/bookInterfaces';
import axios from '../config/axiosConfig';
import { StatusCode } from '../helpers/statusCode';
import { IQueryBooks } from '../interfaces/bookInterfaces';
import { ValidationError } from 'joi';
import { JoiExceptions } from '../exceptions/joiException';
import schema from '../validations/books';
import { sanitizeNullObject } from '../helpers/sanitizer';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
    const {bibleId} = req.params;

    const q: IQueryBooks = req.query;

    try {
        await schema.booksSchema.validateAsync(q);
    } catch (err) {
        const error = err as ValidationError;;
        throw new JoiExceptions(error);
    }

    const filteredQ = sanitizeNullObject(q);

    const booksResponse: AxiosResponse<IBooks> = await axios.get(`/bibles/${bibleId}/books`, {
        params: filteredQ
    });
    const books: IBookData[] = booksResponse.data.data;

    res.status(StatusCode.OK).json(books);
    return;
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
    const {bibleId, bookId} = req.params;
    
    const q: IQueryBook = req.query;

    try {
        await schema.bookSchema.validateAsync(q);
    } catch (err) {
        const error = err as ValidationError;
        throw new JoiExceptions(error);
    }

    const filteredQ = sanitizeNullObject(q);

    const bookResponse: AxiosResponse<IBook> = await axios.get(`/bibles/${bibleId}/books/${bookId}`, {
        params: filteredQ
    });
    const book: IBookData = bookResponse.data.data;

    res.status(StatusCode.OK).json(book);    
    return;
};