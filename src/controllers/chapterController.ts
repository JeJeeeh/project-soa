import { Request, Response } from 'express';
import joi from 'joi';
import { StatusCode } from '../helpers/statusCode';
import axios from '../config/axiosConfig';
import { AxiosResponse } from 'axios';
interface IQueryChapters {
    bibleId: string;
    bookId: string;
}

interface IChapters {
    data: IChaptersData[];
}

interface IChaptersData {
    id: string;
    bibleId: string;
    number: string;
    bookId: string;
    reference: string;
}

export const getChapters = async (req: Request, res: Response): Promise<void> => {
    const q: IQueryChapters = { bibleId: req.params.bibleId, bookId: req.params.bookId };

    const regexQuery = new RegExp(/^[^:].*$/);
    const schema = joi.object({
        bibleId: joi.string().pattern(regexQuery).required(),
        bookId: joi.string().pattern(regexQuery).required(),
    });

    try {
        await schema.validateAsync(q);
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ status: StatusCode.BAD_REQUEST, message: 'Invalid parameters' });
        return;
    }

    const chaptersResponse: AxiosResponse<IChapters> = await axios.get(`/bibles/${ q.bibleId }/books/${ q.bookId }/chapters`);
    const chapters: IChaptersData[] = chaptersResponse.data.data;

    res.status(StatusCode.OK).json(chapters);

};