import express from 'express';
import {videoControllers} from '../videos/VideoControllers';
const videosRouter = express.Router();
const testingRouter = express.Router();

// Определяем маршруты
videosRouter.get('/', videoControllers.getVideos); // Получение всех видео
// @ts-ignore
videosRouter.get('/:id', videoControllers.getVideo); // Получение видео по id
// @ts-ignore
videosRouter.post('/', videoControllers.createVideo); // Создание нового видео
// @ts-ignore
videosRouter.put('/:id', videoControllers.updateVideo); // Обновление видео
// @ts-ignore
videosRouter.delete('/:id', videoControllers.deleteVideo); // Удалить одно видео
testingRouter.delete('/all-data', videoControllers.deleteAllVideos); // Удаление всех видео




export { videosRouter, testingRouter };

