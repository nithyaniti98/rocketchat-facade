const { driver } = require("@rocket.chat/sdk")

const { LoginCredentialsError, RocketChatConnectionError, InvalidRecipientError } = require("./errors");
const config = require("./config");

const { dev: { HOST, SSL } } = config;
const HELPER_STRING = "Please respond with \"close task\" to close this task, " +
    "or contact the required blabla" //TEMPORARY

let myUsername;
let subscribedRooms = [];


const openTask = async ({botUsername, password, message, recipientUsername}) => {
    myUsername = botUsername;
    try {
        await startBot(botUsername, password);

        const roomId = await sendMessageThroughBot(message, recipientUsername)
        await sendMessageThroughBot(HELPER_STRING, recipientUsername)
        await addSubscription(roomId);
        return {
            status: 200,
            message: "Open task notification successful"
        }
    } catch (err) {
        let apiResponse = {
            status: null,
            message: err.message
        }
        if (err instanceof LoginCredentialsError) {
            apiResponse.status = 403
            return apiResponse
        } else if (err instanceof RocketChatConnectionError) {
            apiResponse.status = 502
            return apiResponse
        } else if (err instanceof InvalidRecipientError) {
            apiResponse.status = 404
            return apiResponse
        } else {
            apiResponse.status = 500
        }
    }
}

const closeTask = async ({botUsername, password, message, recipientUsername}) => {
    await startBot(botUsername, password);

    const roomId = sendMessageThroughBot(message, recipientUsername)
    removeSubscription(roomId);
}

const startBot = async(username, password, hostUrl = HOST) => {
    await driver.connect({host: hostUrl, useSsl: SSL})
        .catch(err => {
            throw new RocketChatConnectionError("5xx Server Connection Error: " + err.message)
        });
    await driver.login({username: username, password: password})
        .catch(err => {
            throw new LoginCredentialsError("Login credentials error")
        });
}

const sendMessageThroughBot = async(message, recipientName) => {
    const messageApiResponse = await driver.sendDirectToUser(message, recipientName)
        .catch(err => {
            throw new InvalidRecipientError("Recipient not found")
        })
    return messageApiResponse.rid;
}

const addSubscription = async(roomId) => { //TODO: how do I test subscription methods?
    subscribedRooms.push(roomId);
    const subscriptionApiResponse = await driver.subscribeToMessages();
    const msgloop = await driver.reactToMessages(processMessages);
}

const processMessages = async(err, message, messageOptions) => {
    if (!err) {
        let senderUsername = message.u.username;
        let roomId = message.rid;
        if (senderUsername !== myUsername && subscribedRooms.indexOf(roomId) !== -1) {
            if (message.msg.toLowerCase().trim() === "close task") {
                await sendMessageThroughBot("Working on closing your task...", senderUsername);
                //TODO: functionality to send back to CS
                //removeSubscription(roomId); //TODO: do I still continue listening till task closed?
                // --> need to edit removeSubscription/closeTask accordingly
            } else {
                await sendMessageThroughBot("ERROR. Invalid command. " + HELPER_STRING, senderUsername);
            }
        }
    }
}

const removeSubscription = (roomId) => {
    let subscribedRoomIdx = subscribedRooms.indexOf(roomId);
    if (subscribedRoomIdx !== -1) {
        subscribedRooms.splice(subscribedRoomIdx, 1);
        if (subscribedRooms.length === 0) {
            driver.disconnect();
        }
    } // TODO: else throw error?
}

const disconnectBot = () => {
    driver.disconnect();
}

module.exports = {
    startBot,
    disconnectBot,
    sendMessageThroughBot,
    openTask,
    closeTask
}