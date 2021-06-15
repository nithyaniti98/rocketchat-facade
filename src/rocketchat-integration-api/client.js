const unirest = require('unirest');

const config = require("../../config");

const {dev: {KOTLIN_HOST_API}} = config;

const sendReceivedMessage = (messageData) => {
    unirest
        .post(KOTLIN_HOST_API)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(messageData)
        .then((response) => {
            console.log(response.body)
        })
}

module.exports = sendReceivedMessage