import express, {Request, Response, Router} from 'express'
import {VideoDBType} from "../types/video-db-type";
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

const inputValidation = (video: CreateVideoInputModel) => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    //#1 title
    if (!video.title) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'title cannot be empty'
        })
    }
    //#2 author
    if (!video.author) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'author cannot be empty'
        })
    }

    //#3 minAgeRestriction
    if (video.minAgeRestriction) {
        if (video.minAgeRestriction < 1 || video.minAgeRestriction > 18) {
            errors.errorsMessages.push({
                message: 'error!!!!', field: 'minAgeRestriction'
            })
        }
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'minAgeRestriction must be between 1 and 18'
        })
    }

    //#4 resolutions
    if (!Array.isArray(video.availableResolution)
        || video.availableResolution.some((res) => !(res in Resolutions))
    ) {
        errors.errorsMessages.push({
            message: 'Invalid resolution provided',
            field: 'availableResolution',
        });
    }

    //#5 dates
    if (video.createdAt && video.publicationDate) {
        const created = new Date(video.createdAt);
        const publication = new Date(video.publicationDate);
        if (publication < created) {
            errors.errorsMessages.push({
                message: 'error!!!!', field: 'publicationDate cannot be less than createdAt'
            })
        }
    }

    return errors.errorsMessages.length > 0 ? errors : undefined;
}


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
        const foundVideo:VideoDBType | undefined = db.videos.find(v => v.id === videoId)

        if (!foundVideo) {
            return res.status(404); // Если видео не найдено, возвращаем 404
        }

        res.status(200).json(foundVideo);
    },

    createVideo: (req: Request, res: Response< VideoOutputModel | OutputErrorsType>) => {
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
            id: Date.now() + Math.random(),
        }
        console.log('New video:', newVideo);
        // добавляем видео в базу данных
        db.videos.push(newVideo)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(newVideo)
    },

    updateVideo: (req: RequestWithUriParams<URIParamsVideoIdModel>, res: Response) => {
        const videoId = Number(req.params.id);
        const video: UpdateVideoInputModel = req.body;

        if (!video.title && !video.canBeDownloaded) {
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({error: "Invalid input data"});
        }

        const foundVideo: any = db.videos.find(v => v.id === videoId)

        if (!foundVideo) {
            return res.status(HTTP_STATUSES.NOT_FOUND_404); // Если видео не найдено, возвращаем 404
        } else {
            if (video.title !== undefined) foundVideo.title = video.title;
            if (video.canBeDownloaded !== undefined) foundVideo.canBeDownloaded = video.canBeDownloaded;

            res.status(HTTP_STATUSES.OK_200).json(foundVideo);
        }

    },
    deleteVideo: (req: RequestWithUriParams<URIParamsVideoIdModel>, res: Response) => {
        const videoIndex = db.videos.findIndex(video => video.id === parseInt(req.params.id));
        if (videoIndex === -1) {
            return res.status(HTTP_STATUSES.NOT_FOUND_404);
        } else {
            db.videos.splice(videoIndex, 1);
            res.status(HTTP_STATUSES.NO_CONTENT_204);
        }
    },
    deleteAllVideos: (req: Request, res: Response) => {
        db.videos = [];
        res.status(HTTP_STATUSES.NO_CONTENT_204).json();
    }
}


