const assert = require("assert");
const chai = require('chai');
chai.use(require('chai-as-promised'));

const expect = chai.expect

const {
    LoginCredentialsError,
    RocketChatConnectionError,
    InvalidRecipientError
} = require("../src/errors");
const {
    startBot,
    disconnectBot,
    sendMessageThroughBot,
    openTask
} = require("../src/rocketChatClient");
const config = require("../src/config")
const { dev: { USERNAME, PASSWORD, HOST} } = config
const { test: { RECIPIENT } } = config


describe('Spinning up RocketChat', function() {
    describe('Connecting to RocketChat', function () {
        it('should connect successfully if no error', async () => {
            await expect(startBot(USERNAME, PASSWORD, HOST))
                .to.be.fulfilled
        });
        it('should throw an 5xx server error if host url is wrong', async () => {
            await expect(startBot(USERNAME, PASSWORD, "http://localhost:2000"))
                .to.be.rejectedWith(RocketChatConnectionError)
        });
    });
    describe('Logging in', function() {
        it('should login successfully if no credential error', async () => {
            await expect(startBot(USERNAME, PASSWORD))
                .to.be.fulfilled
        });
        it('should throw an 4xx client error if username is wrong', async () => {
            await expect(startBot("badUsername", PASSWORD))
                .to.be.rejectedWith(LoginCredentialsError)
        });
        it('should throw an 4xx client error if password is wrong', async () => {
            await expect(startBot(USERNAME, "badPassword"))
                .to.be.rejectedWith(LoginCredentialsError)
        })
    });
});


describe('Sending a direct message using sendMessage()', function() {
    beforeEach(async () => await startBot(USERNAME, PASSWORD))
    afterEach(() => disconnectBot())
    it("should send successfully if recipient is found", async () => {
        await expect(sendMessageThroughBot("success test", RECIPIENT))
            .to.be.fulfilled
    })
    it("should throw an 4xx client error if recipient not found", async () => {
        await expect(sendMessageThroughBot("fail test", "badRecipient"))
            .to.be.rejectedWith(InvalidRecipientError)
    })
})

describe('EndToEnd Tests', function() {
    describe("Open Task", function () {
        afterEach(() => disconnectBot());
        const openTaskMessage = "You have an open task XXXX. Please fix it by ..."
        it('should throw an 403 error if username is wrong', async () => {
            let res = await openTask({
                botUsername: "badUsername",
                password: PASSWORD,
                message: openTaskMessage,
                recipientUsername: RECIPIENT
            })
            expect(res)
                .to.deep.equal({status: 403, message: "Login credentials error"})
        });
        it('should throw an 403 client error if password is wrong', async () => {
            let res = await openTask({
                botUsername: USERNAME,
                password: "wrongPassword",
                message: openTaskMessage,
                recipientUsername: RECIPIENT
            })
            expect(res)
                .to.deep.equal({status: 403, message: "Login credentials error"})
        });
        it("should throw an 404 client error if recipient not found", async () => {
           let res = await openTask({
                botUsername: USERNAME,
                password: PASSWORD,
                message: openTaskMessage,
                recipientUsername: "badUsername"
            })
           expect(res)
               .to.deep.equal({status: 404, message: "Recipient not found"})
        });
        it("should send open task message successfully", async () => {
            let res = await openTask({
                botUsername: USERNAME,
                password: PASSWORD,
                message: openTaskMessage,
                recipientUsername: RECIPIENT
            })
            expect(res)
                .to.deep.equal({status: 200, message: "Open task notification successful"})
        });
    })
})