import { Request, Response } from 'express';
import axios from '../config/axiosConfig';
import { AxiosResponse } from 'axios';
import { StatusCode } from '../helpers/statusCode';
import { sanitizeNullObject } from '../helpers/sanitizer';
import Joi, { ObjectSchema } from 'joi';

interface IBibles {
    data: IBibleData[];
}
interface IBible {
    data: IBibleData;
}

interface IBibleData {
    id: string;
    dblId: string;
    abbreviation: string;
    abbreviationLocal: string;
    language: {
        id: string;
        name: string;
        nameLocal: string;
        script: string;
        scriptDirection: string;
    },
    countries: [
        {
            id: string;
            name: string;
            nameLocal: string;
        }
    ],
    name: string;
    nameLocal: string;
    description: string;
    descriptionLocal: string;
    relatedDbl: string;
    type: string;
    updatedAt: Date;

    copyright?: string;
    info?: string;

    audioBibles?: unknown[];
}

interface IQueryBible {
    language?: string;
    abbreviation?: string;
    name?: string;
    ids?: string;
}

export const getBibles = async (req: Request, res: Response): Promise<void> => {
    const q: IQueryBible = req.query;

    const schema: ObjectSchema = Joi.object({
        language: Joi.string().max(3).optional().allow('', null),
        abbreviation: Joi.string().max(3).optional().allow('', null),
        name: Joi.string().max(50).optional().allow('', null),
        ids: Joi.string().max(50).optional().allow('', null),
    });

    try {
        await schema.validateAsync(q);
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ status: StatusCode.BAD_REQUEST, message: 'Invalid parameters' });
        return;
    }

    const filteredQ = sanitizeNullObject(q);

    const bibleResponse: AxiosResponse<IBibles> = await axios.get('/bibles', {
        params: filteredQ,
    });
    const bible: IBibleData[] = bibleResponse.data.data.map(rest => {
        delete rest.audioBibles;
        return rest;
    });

    res.status(StatusCode.OK).json(bible);
    return;
};

export const getBible = async (req: Request, res: Response): Promise<void> => {
    const bibleId: string = req.params.bibleId;

    const bibleResponse: AxiosResponse<IBible> = await axios.get(`/bibles/${ bibleId }`);
    const bible: IBibleData = bibleResponse.data.data;

    delete bible.audioBibles;

    res.status(StatusCode.OK).json(bible);
    return;
};
