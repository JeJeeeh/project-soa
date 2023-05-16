import { Request, Response } from 'express';
import joi, { ObjectSchema } from 'joi';
import { StatusCode } from '../helpers/statusCode';
import axios from '../config/axiosConfig';
import { AxiosResponse } from 'axios';
import { ContentType } from '../helpers/contentType';
import { sanitizeNullObject } from '../helpers/sanitizer';
interface IQueryChapters {
    bibleId: string;
    bookId: string;
}
interface IParamChapter {
    bibleId: string;
    chapterId: string;
}

interface IQueryChapter {
    'content-type'?: ContentType;
    'include-notes'?: boolean;
    'include-titles'?: boolean;
    'include-chapter-numbers'?: boolean;
    'include-verse-numbers'?: boolean;
    'include-verse-spans'?: boolean;
    'parallels'?: string;
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

interface IChapter {
    data: IChapterData;
    meta?: unknown;
}

interface IChapterData {
    id: string;
    bibleId: string;
    number: string;
    bookId: string;
    content: string;
    reference: string;
    verseCount: number;
    next?: {
        id?: string;
        bookId?: string;
        number?: string;
    };
    previous?: {
        id?: string;
        bookId?: string;
        number?: string;
    };
    copyright: string;
}


export const getChapters = async (req: Request, res: Response): Promise<void> => {
    const q: IQueryChapters = { bibleId: req.params.bibleId, bookId: req.params.bookId };

    const regexQuery = new RegExp(/^[^:].*$/);
    const schema: ObjectSchema = joi.object({
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

export const getChapter = async (req: Request, res: Response): Promise<void> => {
    const q: IParamChapter = { bibleId: req.params.bibleId, chapterId: req.params.chapterId };

    const regexQuery = new RegExp(/^[^:].*$/);
    const schema: ObjectSchema = joi.object({
        bibleId: joi.string().pattern(regexQuery).required(),
        chapterId: joi.string().pattern(regexQuery).required(),
    });

    try {
        await schema.validateAsync(q);
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ status: StatusCode.BAD_REQUEST, message: 'Invalid parameters' });
        return;
    }

    const param: IQueryChapter = {
        'content-type': req.query[ 'content-type' ] as ContentType,
        'include-notes': Boolean(req.query[ 'include-notes' ]) ?? false,
        'include-titles': Boolean(req.query[ 'include-tiles' ]) ?? true,
        'include-chapter-numbers': Boolean(req.query[ 'include-chapter-numbers' ]) ?? false,
        'include-verse-numbers': Boolean(req.query[ 'include-verse-numbers' ]) ?? true,
        'include-verse-spans': Boolean(req.query[ 'include-verse-spans' ]) ?? false,
        'parallels': req.query[ 'parallels' ] as string,
    };

    const filteredParam = sanitizeNullObject(param);

    const chapterResponse: AxiosResponse<IChapter> = await axios.get(`/bibles/${ q.bibleId }/chapters/${ q.chapterId }`, {
        params: filteredParam,
    });

    delete chapterResponse.data.meta;

    const chapter: IChapterData = chapterResponse.data.data;

    res.status(StatusCode.OK).json(chapter);
};