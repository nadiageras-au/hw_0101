import {Resolutions} from "types/video-db-type";

export type CreateVideoInputModel =  {
    title: string
    author: string
    canBeDownloaded?: boolean
    minAgeRestriction?: number | null
    createdAt?: string
    publicationDate?: string
    availableResolution?: Resolutions[]

}