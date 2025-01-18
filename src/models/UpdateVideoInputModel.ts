import {Resolutions} from "db/db";

type MinAgeRestriction = number & { readonly __brand: 'MinAgeRestriction' };

function createMinAgeRestriction(age: number): MinAgeRestriction | null {
    if (age === null) return null;
    if (age >= 1 && age <= 18) {
        return age as MinAgeRestriction;
    }
    throw new Error('minAgeRestriction must be between 1 and 18');
}

export type UpdateVideoInputModel = {
    id?: number;
    title?: string;
    author?: string;
    canBeDownloaded?: boolean; // By default - false
    minAgeRestriction?: MinAgeRestriction; // maximum: 18 - minimum: 1 default: null
    createdAt?: string;
    publicationDate?: string; // By default - +1 day from CreatedAt
    availableResolution?: Resolutions[];
    errorsMessages?: string[];
};