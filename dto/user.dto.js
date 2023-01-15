class UserDTO {
    username;
    email;

    constructor(username, email) {
        this.username = username;
        this.email = email;
    }
}

class UserDTOBuilder {

    constructor(username, email) {
        this.userDTO = new UserDTO(username, email);
    }

    setUsername(username) {
        this.userDTO.username = username;
        return this;
    }

    setEmail(email) {
        this.userDTO.email = email;
        return this;
    }

    build() {
        return this.userDTO;
    }
}

module.exports = {
    UserDTO,
    UserDTOBuilder
}