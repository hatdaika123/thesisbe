class UserAuthDTO {
    username;
    token;
    email;

    constructor(username, token, email) {
        this.username = username;
        this.token = token;
        this.email = email;
    }

}

class UserAuthDTOBuilder {

    constructor(username, token, email) {
        this.userAuthDTO = new UserAuthDTO(username, token, email); 
    }

    setUsername(username) {
        this.userAuthDTO.username = username;
        return this; 
    }

    setToken(token) {
        this.userAuthDTO.token = token;
        return this;
    }

    setEmail(email) {
        this.userAuthDTO.email = email;
        return this;
    }

    build() {
        return this.userAuthDTO;
    }
}

module.exports = {
    UserAuthDTO,
    UserAuthDTOBuilder
};