import {Resolutions, ResolutionsString} from "types/video-db-type";

export type VideoOutputModel = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolution: ResolutionsString[]
}