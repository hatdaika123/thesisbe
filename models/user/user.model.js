const mongoose = require('mongoose');
const { categorySchema } = require('../category/category.model');
const { expenceSchema } = require('../expence/expence.model');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    expences: [expenceSchema],
    categories: [categorySchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;