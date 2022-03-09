const supertest = require('supertest');

const app = require('../src/app');

describe('example', () => {
    const request = supertest(app);

    it("example test", async () => {
        const response = await request
            .get('/');

        expect(response.body).toMatchObject(
            { message: "hi 😎" }
        )
    });
});