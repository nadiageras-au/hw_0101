import {req} from './test-helpers';
import request from "supertest";
import {Resolutions, setDB} from '../src/db/db'
// import {dataset1} from './datasets'
import {SETTINGS} from '../src/settings';
import {HTTP_STATUSES} from '../src/utils';
import {CreateVideoInputModel} from '../src/models/CreateVideoInputModel';
import {app} from "../src/app";
import {UpdateVideoInputModel} from "../src/models/UpdateVideoInputModel";

describe('/videos', () => {
    let createdVideo1: any = null;
    setDB()
    beforeEach(() => { // Очистка базы данных перед каждым тестом
        // setDB();
    });

    it('should get an empty array', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200);
        expect(res.body.length).toBe(0); // Проверяем, что массив пустой
    });

    it('should create a new video with correct data', async () => {
        const data: CreateVideoInputModel = {
            title: 'new video name',
            author: 'new author',
            canBeDownloaded: false,
            minAgeRestriction: 12,
            availableResolution: [Resolutions.P144, Resolutions.P240],
        };

        const createResponse = await request(app)
            .post(SETTINGS.PATH.VIDEOS)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdVideo1 = createResponse.body;

        const getResponse = await request(app)
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200);

        expect(getResponse.body.length).toBe(1); // Проверяем, что массив содержит 1 элемент
        expect(getResponse.body[0]).toEqual(createdVideo1); // Проверяем, что данные совпадают
    });

    it('should update an existing video with correct data', async () => {
        // Создаём видео перед обновлением

        const updateData: UpdateVideoInputModel = {
            title: 'updated video name',
            canBeDownloaded: true,
        };

        const updateResponse = await request(app)
            .put('/videos/' + createdVideo1.id)
            .send(updateData)
            .expect(HTTP_STATUSES.OK_200);

        const getResponse = await request(app)
            .get('/videos/' + createdVideo1.id)
            .expect(HTTP_STATUSES.OK_200);

        expect(getResponse.body).toEqual({
            ...createdVideo1,
            ...updateData, // Поля, которые были обновлены
        });
    });

    it(`should delete video`, async ()=> {
        await request(app)
            .delete('/videos/' + createdVideo1.id)
    });

    it(`should delete all videos`, async ()=> {
        await request(app)
            .delete('/videos')
            .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    it('should return empty array after deleting all videos', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200);

        expect(res.body.length).toBe(0); // Проверяем, что массив пустой
    });
});
