const { UserDTOBuilder } = require("../dto/user.dto");
const { UserAuthDTOBuilder } = require("../dto/userAuth.dto");

function userDTOFromUser(user) {
    return new UserDTOBuilder()
        .setUsername(user.username)
        .setEmail(user.email)
        .build();
}

function userAuthDTOFromUserAndToken(user, token) {
    return new UserAuthDTOBuilder()
        .setUsername(user.username)
        .setToken(token)
        .setEmail(user.email)
        .build();
}

module.exports = {
    userDTOFromUser,
    userAuthDTOFromUserAndToken
}