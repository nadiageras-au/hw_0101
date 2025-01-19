
export enum Resolutions {
    P144 = '144p',
    P240 = '240p',
    P360 = '360p',
    P480 = '480p',
    P720 = '720p',
    P1080 = '1080p',
    P1440 = '1440p',
    P2160 = '2160p',
}

export type ResolutionsString = keyof typeof Resolutions
// const x = Resolutions.P144
// const y = Resolutions[x]
// const z = Resolutions['P144']


export type VideoDBType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolution: Resolutions[]
}


