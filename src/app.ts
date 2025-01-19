import express from 'express';
// import cors from 'cors';
import {SETTINGS} from "./settings";
import {videosRouter, testingRouter} from "./routes/videos";

export const app = express();
app.use(express.json());
// app.use(cors());

// app.get('/', (req, res) => {
//     res.status(200).json({ version: '1.0' });
// });
app._router.stack
    .filter((r:any) => r.route) // Получаем только маршруты
    .map((r:any) => {
        console.log(`${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
    });
// app.get(SETTINGS.PATH.VIDEOS, videosRouter)
app.use(SETTINGS.PATH.VIDEOS, videosRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter);
// app.use(SETTINGS.PATH.VIDEOS, videosRouter)