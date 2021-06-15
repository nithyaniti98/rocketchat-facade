require('dotenv').config({path: __dirname + '/.env'})

const config = {
    dev : {
        ROCKETCHAT_HOST: 'http://localhost:3000',
        USERNAME: process.env.BOT_USERNAME,
        PASSWORD: process.env.BOT_PASSWORD,
        SSL: false,
        KOTLIN_HOST_API: 'http://localhost:8080/processMessages'
    },
    test : {
        RECIPIENT: process.env.MESSAGE_RECIPIENT
    }
}

module.exports = config