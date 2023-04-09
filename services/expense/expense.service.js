const { Expense } = require("../../models/expense/expense.model");
const { throwNotFoundError } = require("../../utilities/helper");

/**
 * 
 * @param {{ }} form 
 * @param {{ username: String, _id: String, iat: Number, exp: Number }} user
 */
async function saveExpense(form, user) {
    const expense = new Expense({
        type: form.type,
        userId: user._id,
        categoryId: form.categoryId,
        location: form.location,
        images: form.images,
        date: form.date,
        amount: form.amount,
        description: form.description
    });

    await expense.save();
}

async function updateExpense(form) {
    try {
        let res = await Expense.updateOne(
            { _id: form._id },
            { $set: form }
        );

        return res.nModified;
    } catch (e) {
        throwExpenseNotFound();
    }
}

/**
 * 
 * @param { { username: String, _id: String, iat: Number, exp: Number } } user 
 * @param { { page: number, pageSize: number } } query 
 * @returns { { data: Expense[], total: number } } data
 */
async function getExpenses(user, query) {
    const page = query.page || 0;
    const pageSize = query.pageSize || 20;

    const offset = page * pageSize;
    const limit = pageSize;

    const expenses = await Expense
        .find({ userId: user._id })
        .select('date categoryId amount type')
        .skip(offset)
        .sort({
            date: -1
        })
        .limit(limit);
    
    const total = await Expense.count()

    return { data: expenses, total };
}

/**
 * 
 * @param { String } id 
 * @returns { Expense } expense
 */
async function getExpenseById(id) {
    try {
        const expense = await Expense
            .findById(id)
            .select('type categoryId amount date description location images');

        return expense;
    } catch (e) {
        throwExpenseNotFound();
    }
}

function throwExpenseNotFound() {
    throwNotFoundError('Expense not found.');
}

module.exports = {
    updateExpense,
    saveExpense,
    getExpenses,
    getExpenseById
}