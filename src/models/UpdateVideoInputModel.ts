import {Resolutions} from "types/video-db-type";

export type UpdateVideoInputModel = {
    id?: number;
    title?: string;
    author?: string;
    canBeDownloaded?: boolean; // By default - false
    minAgeRestriction?: number; // maximum: 18 - minimum: 1 default: null
    createdAt?: string;
    publicationDate?: string; // By default - +1 day from CreatedAt
    availableResolutions?: Resolutions[];
    errorsMessages?: string[];
};