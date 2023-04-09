const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: Date,
    images: [String],
    location: String,
    categoryId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    type: String
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = {
    expenseSchema,
    Expense
};