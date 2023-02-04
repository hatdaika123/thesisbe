const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    name: String,
    description: String,
    amount: Number,
    date: Date,
    photos: [String],
    location: String,
    categoryId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = {
    expenseSchema,
    Expense
};