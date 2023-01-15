const mongoose = require('mongoose');

const expenceSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: Date,
    photos: [String],
    location: String,
    categoryId: mongoose.Types.ObjectId
});

module.exports = {
    expenceSchema
};