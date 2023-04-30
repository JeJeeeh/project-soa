import { AxiosInstance, default as ax } from 'axios';

const axios: AxiosInstance = ax.create({
    baseURL: 'https://api.scripture.api.bible/v1',
    headers: {
        'api-key': process.env.API_KEY,
    },
});


export default axios;