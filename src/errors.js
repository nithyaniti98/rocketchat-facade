class HTTPError extends Error {
    constructor(message, status, data) {
        super(message);
        this.httpErrorStatus = status
        this.data = data
    }
}

class RocketChatConnectionError extends HTTPError {
    constructor(detailedMessage, errorData) {
        super(RocketChatConnectionError.httpErrorMessage, 502, errorData);
        this.detailedMessage = detailedMessage
    }

    static httpErrorMessage = "RocketChat server connection error. Please try again."
}

class LoginCredentialsError extends HTTPError {
    constructor(detailedMessage, errorData) {
        super(LoginCredentialsError.httpErrorMessage, 403, errorData);
        this.detailedMessage = detailedMessage
    }

    static httpErrorMessage = "Login Credentials Error"
}

class InvalidRecipientError extends HTTPError {
    constructor(detailedMessage, errorData) {
        super(InvalidRecipientError.httpErrorMessage, 404, errorData);
        this.detailedMessage = detailedMessage
    }

    static httpErrorMessage = "Recipient not found"
}

module.exports = {
    HTTPError,
    LoginCredentialsError,
    RocketChatConnectionError,
    InvalidRecipientError
}