class RocketChatConnectionError extends Error {
    constructor(message) {
        super(message);
        this.name = "RocketChatConnectionError";
    }
}

class LoginCredentialsError extends Error {
    constructor(message) {
        super(message);
        this.name = "LoginCredentialsError";
    }
}

class InvalidRecipientError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidRecipientError";
    }
}

module.exports = {
    LoginCredentialsError,
    RocketChatConnectionError,
    InvalidRecipientError
}