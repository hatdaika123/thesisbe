const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    icon: String,
    userId: mongoose.Types.ObjectId
});

const Category = mongoose.model('Category', categorySchema);

module.exports = {
    categorySchema,
    Category
};
