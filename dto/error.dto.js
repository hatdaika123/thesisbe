class ErrorDTO {
    status;
    message = "";
    timestamp;

    constructor(status, message) {
        this.status = status;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }
}

class ErrorDTOBuilder {
    constructor(status, message) {
        this.errorDTO = new ErrorDTO(status, message);
    }

    setStatus(status) {
        this.errorDTO.status = status;
        this.errorDTO.timestamp = new Date().toISOString();
        return this;
    }

    setMessage(message) {
        this.errorDTO.message = message;
        return this;
    }

    build() {
        return this.errorDTO;
    }
}

module.exports = {
    ErrorDTO,
    ErrorDTOBuilder
};