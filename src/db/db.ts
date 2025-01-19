import {VideoDBType} from '../types/video-db-type'

export type DBType = {
    videos: VideoDBType[]
}


export const db: DBType = {
    videos: [],
        // {
            // // id: Date.now() + Math.random(),
            // id: Date.now() + Math.random(),
            // title: 't' + Date.now() + Math.random(),
            // author: 'a' + Date.now() + Math.random(),
            // canBeDownloaded: true,
            // minAgeRestriction: null,
            // createdAt: new Date().toISOString(),
            // publicationDate: new Date().toISOString(),
            // availableResolution: [Resolutions.P240],
        // },
        // {
        //     id: 2,
        //     title: 'Sample Video',
        //     author: 'Author Name',
        //     canBeDownloaded: true,
        //     minAgeRestriction: 18,
        //     createdAt: '2025-01-15T10:00:00Z',
        //     publicationDate: '2025-01-16T10:00:00Z',
        //     availableResolution: [Resolutions.P240, Resolutions.P720], // Корректное использование
        // },
        // {
        //     id: 3,
        //     title: 'Sample Video 3',
        //     author: 'Author Name 3',
        //     canBeDownloaded: true,
        //     minAgeRestriction: 18,
        //     createdAt: '2025-01-15T10:00:00Z',
        //     publicationDate: '2025-01-16T10:00:00Z',
        //     availableResolution: [Resolutions.P240, Resolutions.P720], // Корректное использование
        // }
    // ]
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        db.videos = []
        // db.some = []
        return
    }

    // если что-то передано - то заменяем старые значения новыми
    db.videos = dataset.videos || db.videos
    // db.some = dataset.some || db.some
}