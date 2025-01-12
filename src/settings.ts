import {config} from 'dotenv';
config();


export const SETTINGS = {
    PORT: process.env.PORT || 3005,
   PATH: {
        VIDEOS: '/videos'
   }
}