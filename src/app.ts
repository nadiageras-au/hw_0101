import express, {Request, Response} from 'express';
import cors from 'cors';
import {SETTINGS} from "./settings";
import {videoControllers} from "./videos/VideosControllers";
import {db} from  './db/db'
import {videosRouter} from "./routes/videos";

export const app = express();
app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//     res.status(200).json({ version: '1.0' });
// });

// app.get(SETTINGS.PATH.VIDEOS, videosRouter)
app.use(SETTINGS.PATH.VIDEOS, videosRouter)
// app.use(SETTINGS.PATH.VIDEOS, videosRouter)