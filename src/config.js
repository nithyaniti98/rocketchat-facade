require('dotenv').config()

const config = {
    dev : {
        HOST: 'http://localhost:3000',
        USERNAME: process.env.BOT_USERNAME,
        PASSWORD: process.env.BOT_PASSWORD,
        SSL: false
    },
    test : {
        RECIPIENT: process.env.MESSAGE_RECIPIENT
    }
}

module.exports = config