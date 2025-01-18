import {Resolutions} from "../db/db";

export type CreateVideoInputModel = {
    /**
     * Video name: string, author: string, canBeDownloaded: boolean, minAgeRestriction: number | null, availableResolution: Resolutions[]
     */
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    availableResolution: Resolutions[],
}