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
    sendMessageThroughBot,
} = require("../src/rocketChatClient");
const config = require("../config")
const {dev: {USERNAME, PASSWORD, ROCKETCHAT_HOST}} = config
const {test: {RECIPIENT}} = config


describe('Spinning up RocketChat', function () {
    describe('Connecting to RocketChat', function () {
        it('should connect successfully if no error', async () => {
            await expect(startBot(USERNAME, PASSWORD, ROCKETCHAT_HOST))
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
    it("should send successfully if recipient is found", async () => {
        await expect(sendMessageThroughBot("success test rocketChatClient", RECIPIENT))
            .to.be.fulfilled
    })
    it("should throw an 4xx client error if recipient not found", async () => {
        await expect(sendMessageThroughBot("fail test RocketChatClient", "badRecipient"))
            .to.be.rejectedWith(InvalidRecipientError)
    })
})