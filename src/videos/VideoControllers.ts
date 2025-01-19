import express, {Request, Response, Router} from 'express'
import {ResolutionsString, VideoDBType} from "../types/video-db-type";
import {db} from '../db/db';
import {Resolutions} from "../types/video-db-type";
import {RequestWithUriParams} from "../types/types";
import {URIParamsVideoIdModel} from "../models/URIParamsVideoIdModel";
import {VideoOutputModel} from "../models/VideoOutputModel";
import {CreateVideoInputModel} from "../models/CreateVideoInputModel";
import {HTTP_STATUSES} from "../utils";
import {UpdateVideoInputModel} from "../models/UpdateVideoInputModel";
import {OutputErrorsType} from "types/output-error-types";

export type DBType = {
    videos: VideoDBType[]
}

const inputValidation = (video: CreateVideoInputModel): OutputErrorsType | undefined => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    };

    //#1 title
    if (!video.title || typeof video.title !== 'string' || video.title.trim() === '' || video.title.length > 40) {
        errors.errorsMessages.push({
            message: 'Title is required and must be a non-empty string',
            field: 'title'
        });
    }

    //#2 author
    if (!video.author || typeof video.author !== 'string' || video.author.trim() === '' || video.author.length > 20) {
        errors.errorsMessages.push({
            message: 'Author is required and must be a non-empty string',
            field: 'author'
        });
    }

    //#3 minAgeRestriction
    if (video.minAgeRestriction) {
        if (video.minAgeRestriction < 1 || video.minAgeRestriction > 18) {
            errors.errorsMessages.push({
                message: 'minAgeRestriction must be between 1 and 18',
                field: 'minAgeRestriction'
            });
        }
    } else {
        video.minAgeRestriction = null;
    }

    //#4 resolutions
    if (!Array.isArray(video.availableResolutions)
        || video.availableResolutions.some((res) => !(res in Resolutions))
    ) {
        errors.errorsMessages.push({
            message: 'Invalid resolution provided',
            field: 'availableResolutions',
        });
    }

    //#5 canBeDownloaded
    if (video.canBeDownloaded !== undefined) {
        if (typeof video.canBeDownloaded !== 'boolean') {
            errors.errorsMessages.push({
                message: 'canBeDownloaded must be a boolean',
                field: 'canBeDownloaded'
            });
        }
    }

    //#6 dates
    if (video.createdAt && video.publicationDate) {
        const created = new Date(video.createdAt);
        const publication = new Date(video.publicationDate);
        if (publication < created) {
            errors.errorsMessages.push({
                message: 'publicationDate cannot be less than createdAt',
                field: 'publicationDate'
            });
        }
    }

    // Return errors if there are any; otherwise, return undefined
    return errors.errorsMessages.length > 0 ? errors : undefined;
};


export const videoControllers = {
    // OutputVideoType[]
    getVideos: (req: Request, res: Response<any | OutputErrorsType>) => {
        const videos = db.videos
        res
            .status(HTTP_STATUSES.OK_200)
            .json(videos)
    },

    getVideo: (req: RequestWithUriParams<URIParamsVideoIdModel>, res: Response<VideoOutputModel | void>) => {
        const videoId = +req.params.id;
        const foundVideo: VideoDBType | undefined = db.videos.find(v => v.id === videoId)

        if (!foundVideo) {
            // return res.status(404).json(); // Если видео не найдено, возвращаем 404
            return res.sendStatus(404); // Если видео не найдено, возвращаем 404
        }

        res.status(200).json(foundVideo);
    },

    createVideo: (req: Request, res: Response<VideoOutputModel | OutputErrorsType>) => {
        const errors = inputValidation(req.body)
        if (errors) { // если есть ошибки - отправляем ошибки

            return res
                .status(400)
                .json(errors)
        }

        const video: CreateVideoInputModel = req.body
        const createdAt = new Date().toISOString(); // Текущая дата
        const createdAtDate = new Date(createdAt);
        const publicationDate = new Date(createdAtDate);
        publicationDate.setDate(createdAtDate.getDate() + 1);

        const newVideo: VideoDBType = {
            ...req.body,
            id: Math.floor(Date.now() + Math.random() * 100000),
            createdAt: createdAt,
            publicationDate: publicationDate.toISOString(),
            minAgeRestriction: video.minAgeRestriction || null,
            canBeDownloaded: video.canBeDownloaded || false
        }
        console.log('New video:', newVideo);
        // добавляем видео в базу данных
        db.videos.push(newVideo)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(newVideo)
    },

    updateVideo: (req: RequestWithUriParams<URIParamsVideoIdModel>, res: Response) => {
        const videoId = Number(req.params.id); // Преобразуем id в число
        const videoUpdates: any = req.body; // Получаем данные для обновления

        // Ищем индекс видео в массиве
        const videoIndex = db.videos.findIndex((v) => v.id === videoId);

        if (videoIndex === -1) {
            // Если видео не найдено, возвращаем 404
            return res.status(HTTP_STATUSES.NOT_FOUND_404).json({
                message: 'Video not found',
            });
        }

        // Создаём новый объект с обновлениями
        const updatedVideo = {
            ...db.videos[videoIndex], // Существующие данные
            ...videoUpdates, // Обновления
        };

        // Валидируем обновлённый объект
        const errors = inputValidation(updatedVideo);
        if (errors) {
            // Если есть ошибки, возвращаем их
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).json(errors);
        }

        // Сохраняем обновлённое видео в массив
        db.videos[videoIndex] = updatedVideo;

        // Возвращаем успешный ответ с обновлённым видео
        return res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    },
    deleteVideo: (req: RequestWithUriParams<URIParamsVideoIdModel>, res: Response) => {
        const videoIndex = db.videos.findIndex(video => video.id === parseInt(req.params.id));
        if (videoIndex === -1) {
            return res.status(HTTP_STATUSES.NOT_FOUND_404).json();
        } else {
            db.videos.splice(videoIndex, 1);
            res.status(HTTP_STATUSES.NO_CONTENT_204).json();
        }
    },
    deleteAllVideos: (req: Request, res: Response) => {
        db.videos = [];
        res.status(HTTP_STATUSES.NO_CONTENT_204).json();
    }
}


