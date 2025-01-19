import {Resolutions} from "db/db";

export type CreateVideoInputModel = {
    /**
     * Video name: string, author: string, availableResolution: Resolutions[]
     */
    title: string
    author: string
    availableResolution: Resolutions[]
}