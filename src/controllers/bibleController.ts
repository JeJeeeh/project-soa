import { Request, Response } from 'express';
import axios from '../config/axiosConfig';
import { AxiosResponse } from 'axios';
import { StatusCode } from '../helpers/statusCode';

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
}

interface IQueryBible {
    language?: string;
    abbreviation?: string;
    name?: string;
    ids?: string;
}

export const getBibles = async (req: Request, res: Response): Promise<void> => {
    const q: IQueryBible = req.query;
    const filteredQ = Object.entries(q).filter(([ , value ]) => value);

    const bibleResponse: AxiosResponse<IBibles> = await axios.get('/bibles', {
        params: filteredQ,
    });
    const bible: IBibleData[] = bibleResponse.data.data;

    res.status(StatusCode.OK).json(bible);
    return;
};

export const getBible = async (req: Request, res: Response): Promise<void> => {
    const bibleId: string = req.params.bibleId;

    const bibleResponse: AxiosResponse<IBible> = await axios.get(`/bibles/${ bibleId }`);
    const bible: IBibleData = bibleResponse.data.data;

    res.status(StatusCode.OK).json(bible);
    return;
};
