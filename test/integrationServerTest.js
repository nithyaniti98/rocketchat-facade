const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let should = chai.should();
let server = require('../src/rocketchat-integration-api/app');
const { InvalidRecipientError, LoginCredentialsError } = require("../src/errors");
const { dev: { USERNAME, PASSWORD } } = require("../config");
const { test: { RECIPIENT } } = require("../config")


describe('Login API Call', function() {
    it('API client receives a 200 success when logging in successfully', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: USERNAME,
                password: PASSWORD
            })
            .end((err, res) => {
                res.should.have.status(200)
                done();
            });
    })
    it('API client receieves as 422 error when username is missing in request payload', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                password: PASSWORD
            })
            .end((err, res) => {
                res.should.have.status(422)
                done();
            });
    })
    it('API client receieves as 422 error when password is missing in request payload', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: USERNAME
            })
            .end((err, res) => {
                res.should.have.status(422)
                done();
            });
    })
    it('API client receives a 403 error when wrong bot username is sent', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: 'badUsername',
                password: PASSWORD
            })
            .end((err, res) => {
                res.should.have.status(403)
                res.body.should.have.property('message',
                    LoginCredentialsError.httpErrorMessage)
                done();
            });
    })
    it('API client receives a 403 error when wrong password is sent', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: USERNAME,
                password: 'badPassword'
            })
            .end((err, res) => {
                res.should.have.status(403)
                res.body.should.have.property('message',
                    LoginCredentialsError.httpErrorMessage)
                done();
            });
    })
})

describe('Send Message API Call', function(){
    beforeEach(async () => chai.request(server)
        .post('/login')
        .send({
            username: USERNAME,
            password: PASSWORD
        }))
    it('API client receives as 422 error when recipient is missing in request payload', (done) => {
        chai.request(server)
            .post('/sendDirectMessage')
            .send({
                message: 'IntegrationServerTest Fail'
            })
            .end((err, res) => {
                res.should.have.status(422)
                done();
            });
    })
    it('API client receieves as 422 error when message is missing in request payload', (done) => {
        chai.request(server)
            .post('/sendDirectMessage')
            .send({
                recipient: RECIPIENT
            })
            .end((err, res) => {
                res.should.have.status(422)
                done();
            });
    })
    it('API client receives a 404 error when invalid recipient is sent', (done) => {
        chai.request(server)
            .post('/sendDirectMessage')
            .send({
                recipient: 'badUsername',
                message: 'IntegrationServerTest Fail'
            })
            .end((err, res) => {
                res.should.have.status(404)
                res.body.should.have.property('message',
                    InvalidRecipientError.httpErrorMessage)
                done();
            });
    })
    it('Recipient successfully notified', (done) => {
        chai.request(server)
            .post('/sendDirectMessage')
            .send({
                recipient: RECIPIENT,
                message: 'IntegrationServerTest Success'
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.nested.property('data.roomId')
                done();
            });
    })
})