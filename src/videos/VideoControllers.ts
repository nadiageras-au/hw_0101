import express, {Request, Response, Router} from 'express'
import {VideoDBType} from "../types/video-db-type";
import {db, Resolutions} from '../db/db'
import {RequestWithUriParams} from "../types/types";
import {URIParamsVideoIdModel} from "../models/URIParamsVideoIdModel";
import {VideoOutputModel} from "../models/VideoOutputModel";
import {CreateVideoInputModel} from "../models/CreateVideoInputModel";
import {HTTP_STATUSES} from "../utils";
import {UpdateVideoInputModel} from "../models/UpdateVideoInputModel";

export type DBType = {
    videos: VideoDBType[]
}


export const videoControllers = {
    // OutputVideoType[]
    getVideos: (req: Request, res: Response) => {
        const videos = db.videos // получаем видео из базы данных
        res
            .status(200)
            .json(videos) // отдаём видео в качестве ответа
    },

    getVideo: (req: RequestWithUriParams<URIParamsVideoIdModel>, res: Response<VideoOutputModel | void>) => {
        const videoId = +req.params.id;
        const foundVideo = db.videos.find(v => v.id === videoId)

        if (!foundVideo) {
            return res.status(404); // Если видео не найдено, возвращаем 404
        }

        res.status(200).json(foundVideo);
    },

    createVideo: (req: Request, res: Response) => {
        const video: CreateVideoInputModel = req.body
        const newVideo: VideoDBType = {
            ...video,
            id: db.videos.length + 1,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString()
        }
        console.log('New video:', newVideo);
        // добавляем видео в базу данных
        db.videos.push(newVideo)
        res.status(HTTP_STATUSES.CREATED_201).json(newVideo) // отдаём видео в качестве ответа
    },

    updateVideo: (req: RequestWithUriParams<URIParamsVideoIdModel>, res: Response) => {
        const videoId = Number(req.params.id);
        const video: UpdateVideoInputModel = req.body;

        if (!video.title && !video.canBeDownloaded) {
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({error: "Invalid input data"});
        }

        const foundVideo: any = db.videos.find(v => v.id === videoId)
        console.log('Before update:', foundVideo);
        console.log('Request body:', req.body);
        if (!foundVideo) {
            return res.status(HTTP_STATUSES.NOT_FOUND_404); // Если видео не найдено, возвращаем 404
        } else {
            if (video.title !== undefined) foundVideo.title = video.title;
            if (video.canBeDownloaded !== undefined) foundVideo.canBeDownloaded = video.canBeDownloaded;

            res.status(HTTP_STATUSES.OK_200).json(foundVideo);
        }


        console.log('Updated database:', db.videos);

    },
    deleteVideo: (req: RequestWithUriParams<URIParamsVideoIdModel>, res: Response) => {
        const videoIndex = db.videos.findIndex(video => video.id === parseInt(req.params.id));
        if (videoIndex === -1) {
            return res.status(HTTP_STATUSES.NOT_FOUND_404).send({message: 'Video not found'});
        } else {
            db.videos.splice(videoIndex, 1);
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        }

    },
}


