import {Resolutions} from "../db/db";

export type VideoOutputModel = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolution: Resolutions[]
}