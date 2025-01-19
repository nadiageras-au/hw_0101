import {config} from 'dotenv';

config();


export const SETTINGS = {
    PORT: process.env.PORT || 3005,
    PATH: {
        VIDEOS: 'hometask_01/api/videos',
        TESTING: 'hometask_01/api/testing'
    }
}