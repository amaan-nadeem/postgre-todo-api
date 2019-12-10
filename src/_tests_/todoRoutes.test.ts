// import app from '../app';
const app = require("../app");
// import supertest from 'supertest';
const supertest = require('supertest')
const request = supertest(app);

describe("Adding todo", () => {
    it("todo added to a database", async done => {
        
        const correctResponse = await request.post('/api/v1/create-todo').send({title: "Job title", description: "To do something in life", isCompleted: true});
        expect(correctResponse.status).toBe(200);
        expect(correctResponse.body).toBeDefined();                 
        done();
    })
    it("todo not added to a database due to wrong body", async done => {
        const response = await request.post('/api/v1/create-todo').send({description: "To do something in life"});
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
        done(); 
    });
    it("Accessing wrong route", async done => {
        const response = await request.post('/api/v1/create-tod').send({title: "Job title", description: "To do something in life"});
        expect(response.status).toBe(404);
        done();
    })
});