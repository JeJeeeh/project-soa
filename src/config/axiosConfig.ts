import { default as ax } from 'axios';
import * as dotenv from 'dotenv';

// dotenv.config({ path: '../../.env' });

const axios = ax.create({
    baseURL: "https://api.scripture.api.bible/v1",
    headers: {
        "api-key": process.env.API_KEY
    }
})


export default axios;