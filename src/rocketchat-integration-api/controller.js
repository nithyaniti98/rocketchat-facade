const { HTTPError } = require("../errors");
const {
    loginRequestSchema,
    sendMessageRequestSchema
} = require("./model");
const { startBot, sendMessageThroughBot, subscribeBot } = require("../rocketChatClient")


const login = async (req, res) => {
    const loginRequestBody = req.body
    const validationResult = loginRequestSchema.validate(loginRequestBody);
    if (validationResult.error) {
        res.status(422).json({
            status: 'error',
            message: 'Invalid request data',
            data: validationResult.value
        });
    } else {
        try {
            await startBot(loginRequestBody.username, loginRequestBody.password)
            res.status(200).json({
                status: 'success',
                message: 'Login Successful',
                data: null
            })
        } catch(err) {
            if (err instanceof HTTPError) {
                res.status(err.httpErrorStatus).json({
                    status: err.error,
                    message: err.message,
                    data: err.data
                })
            } else {
                res.status(500).json({
                    status: 'error',
                    message: err.message,
                    data: null
                })
            }
        }
    }
}

const sendDirectMessage = async (req, res) => {
    const messageRequestBody = req.body
    const validationResult = sendMessageRequestSchema.validate(messageRequestBody);
    if (validationResult.error) {
        res.status(422).json({
            status: 'error',
            message: 'Invalid request data',
            data: validationResult.value
        });
    } else {
        try {
            let roomId = await sendMessageThroughBot(
                messageRequestBody.message,
                messageRequestBody.recipient
            )
            res.status(200).json({
                status: 'success',
                message: 'Send Message Successful',
                data: {
                    roomId: roomId
                }
            })
        } catch(err) {
            if (err instanceof HTTPError) {
                res.status(err.httpErrorStatus).json({
                    status: err.error,
                    message: err.message,
                    data: err.data
                })
            } else {
                res.status(500).json({
                    status: 'error',
                    message: err.message,
                    data: null
                })
            }
        }
    }
}

const subscribeToMessages = async (req, res) => {
    try {
        await subscribeBot();
        res.status(200).json({
            status: 'success',
            message: 'Subscription Successful',
            data: null
        })
    } catch(err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
            data: null
        })
    }
}

const disconnect = async (req, res) => {
    try {
        await subscribeBot();
        res.status(200).json({
            status: 'success',
            message: 'Disconnection Successful',
            data: null
        })
    } catch(err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
            data: null
        })
    }
}


module.exports = {
    login,
    sendDirectMessage,
    subscribeToMessages,
    disconnect
}