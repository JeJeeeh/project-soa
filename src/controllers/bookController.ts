import { Request, Response } from 'express';

export const getBooks = async (req: Request, res: Response): Promise<Response> => {
    return res.send('books');
};

export const getBook = async (req: Request, res: Response): Promise<Response> => {
    return res.send('book');
};