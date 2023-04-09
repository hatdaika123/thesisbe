const { ErrorDTOBuilder } = require("../dto/error.dto");
const HTTP_STATUS = require('http-status');

/**
 * throw bad request error
 */
function throwBadRequestError() {
    throw new ErrorDTOBuilder()
        .setStatus(HTTP_STATUS.BAD_REQUEST)
        .setMessage('Bad Request.')
        .build();
}

/**
 * @param { String } message
 * throw not found error
 */
function throwNotFoundError(message) {
    throw new ErrorDTOBuilder()
        .setStatus(HTTP_STATUS.NOT_FOUND)
        .setMessage(message)
        .build();
}

module.exports = {
    throwBadRequestError,
    throwNotFoundError
}