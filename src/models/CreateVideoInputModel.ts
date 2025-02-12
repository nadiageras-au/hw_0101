import {Resolutions, ResolutionsString} from "types/video-db-type";

export type CreateVideoInputModel = {
    title: string
    author: string
    canBeDownloaded?: boolean
    minAgeRestriction?: number | null
    createdAt?: string
    publicationDate?: string
    availableResolutions: ResolutionsString[] | null

}