const bcrypt = require('bcrypt');
const User = require('../../models/user/user.model');
const { ErrorDTOBuilder } = require('../../dto/error.dto');
const HTTP_STATUS = require('http-status');
const { userDTOFromUser, userAuthDTOFromUserAndToken } = require('../../mappers/user.mapper');
const jwt = require('jsonwebtoken');
const { UserDTO } = require('../../dto/user.dto')
const { UserAuthDTO } = require('../../dto/userAuth.dto');
const { Category } = require('../../models/category/category.model');
const DEFAULT_CATEGORY = [
    { name: 'Food', icon: 'e57a', description: '' },
    { name: 'Transportation', icon: 'e530', description: '' },
    { name: 'Education', icon: 'e80c', description: '' }
];

/**
 * 
 * @param {{ username: String, password: String, email: String }} form 
 * @returns { UserDTO } UserDTO
 */
async function addUser(form) {
    const encryptedPassword = await bcrypt.hash(form.password, 10);
    form.password = encryptedPassword;

    const user = new User(form);
    await user.save();

    assignUserWithCategories(user, DEFAULT_CATEGORY);

    return userDTOFromUser(user);
}

/**
 * @param {{ username: String, password: String, email: String }} form 
 * @returns { UserDTO } UserDTO
 * @throws ErrorDTO
 */
async function registerUser(form) {
    const user = await User.findOne({ username: form.username });
    
    if (!!user) throw new ErrorDTOBuilder()
        .setStatus(HTTP_STATUS.CONFLICT)
        .setMessage('Username already taken.')
        .build();
    
    return addUser(form);
}

/**
 * 
 * @param {{ username: String, password: String }} form 
 * @returns { UserAuthDTO } UserAuthDTO
 * @throws ErrorDTO
 */
async function authenticateUser(form) {
    const user = await User.findOne({ username: form.username });

    if (!user) {
        throw new ErrorDTOBuilder()
            .setStatus(HTTP_STATUS.NOT_FOUND)
            .setMessage('User not found.')
            .build();
    }

    if (await bcrypt
        .compare(form.password, user.password) === false) {
        throw new ErrorDTOBuilder()
            .setStatus(HTTP_STATUS.UNAUTHORIZED)
            .setMessage('Invalid Password')
            .build();
    }

    const token = generateJwtToken(user);

    return userAuthDTOFromUserAndToken(user, token);
}

/**
 * 
 * @param { User } user
 * @returns { String } token 
 */
function generateJwtToken(user) {
    return jwt.sign(
        { 
            username: user.username,
            _id: user._id
        },
        process.env.JWT_PRIVATE_KEY,
        {
            expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME
        }
    );
}

/**
 * 
 * @param {User} user 
 * @param {{ name: String, icon: String}[]} categories 
 */
async function assignUserWithCategories(user, categories) {
    for (let category of categories) {
        let c = new Category({...category, userId: user._id});
        await c.save();
    }
}

module.exports = {
    registerUser,
    authenticateUser
}