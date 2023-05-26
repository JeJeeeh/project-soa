import { AxiosError, AxiosInstance, default as ax } from 'axios';
import { BibleExceptions } from '../exceptions/bibleExceptions';

const API_KEY: string = process.env.API_KEY || '';

const axios: AxiosInstance = ax.create({
    baseURL: 'https://api.scripture.api.bible/v1',
    headers: {
        'api-key': API_KEY,
    },
});

interface IBibleError {
    statusCode: number;
    error: string;
    message: string;
}

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        const err = error.response?.data as IBibleError;
        throw new BibleExceptions(err.statusCode, err.message);
    },
);

export default axios;