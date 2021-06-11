const express = require('express');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = require('supertest');

let should = chai.should();
let server = require('../src/rocketchat-integration-api/app');
const { USERNAME, PASSWORD } = require("../src/config");



describe('POST notify open task', function () {
    it('API client receives a 403 error when invalid recipient is sent', (done) => {
        chai.request(server)
            .post("/openTask")
            .send({
                username: USERNAME,
                password: PASSWORD,
                taskId: "TASK12345",
                recipient: "badUsername",
                message: "Error found in task TASK12345. Contact xyz.. to rectify the issue"
            })
            .end((err, res) => {
                res.should.have.status(403)
                done();
            });
    })
    it('Recipient successfully notified', (done) => {
        chai.request(server)
            .post("/openTask")
            .send({
                username: USERNAME,
                password: PASSWORD,
                taskId: "TASK12345",
                recipient: "nithyaniti",
                message: "Error found in task TASK12345. Contact xyz.. to rectify the issue"
            })
            .end((err, res) => {
                res.should.have.status(200)
                done();
            });
    })
})