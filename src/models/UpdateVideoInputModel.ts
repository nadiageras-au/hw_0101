import {Resolutions, ResolutionsString} from "types/video-db-type";

export type UpdateVideoInputModel = {
    title: string;
    author: string;
    canBeDownloaded?: boolean; // By default - false
    minAgeRestriction?: number; // maximum: 18 - minimum: 1 default: null
    availableResolutions?: ResolutionsString[];
    errorsMessages?: string[];
    // createdAt?: string;
    // publicationDate?: string; // By default - +1 day from CreatedAt

};