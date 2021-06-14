const { driver } = require("@rocket.chat/sdk")

const {
    LoginCredentialsError,
    RocketChatConnectionError,
    InvalidRecipientError
} = require("./errors");
const config = require("../config");

const { dev: { HOST, SSL } } = config;


const startBot = async(username, password, hostUrl = HOST) => {
    await driver.connect({host: hostUrl, useSsl: SSL})
        .catch(err => {
            throw new RocketChatConnectionError(err.message, {
                rocketChatHost: hostUrl,
                useSsl: SSL
            })
        });
    await driver.login({username: username, password: password})
        .catch(err => {
            throw new LoginCredentialsError(err.message, {
                username: username,
                password: password
            })
        });
}

const sendMessageThroughBot = async(message, recipientName) => { //TODO: should I error check if have login here?
    const messageApiResponse = await driver.sendDirectToUser(message, recipientName)
        .catch(err => {
            throw new InvalidRecipientError(err.message, {
                recipient: recipientName
            })
        })
    return messageApiResponse.rid
}

const subscribeBot = async() => {
    await driver.subscribeToMessages();
    await driver.reactToMessages(processMessages);
}

const processMessages = async(err, message, messageOptions) => {
    if (!err) {
        console.log(message)
    }
}

const disconnectBot = () => { //never used
    driver.disconnect();
}

module.exports = {
    startBot,
    disconnectBot,
    sendMessageThroughBot,
    subscribeBot
}