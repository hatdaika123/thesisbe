const { Expense } = require("../../models/expense/expense.model");

/**
 * 
 * @param {{ username: String, _id: String, iat: Number, exp: Number }} user
 * @returns {{ expense: number, income: number }} summary 
 */
async function getOverviewSummary(user) {
    const expenses = await Expense
        .find({ userId: user._id });
    let summary = { income: 0, expense: 0 };
    expenses.forEach(expense => {
        if (expense.type === 'expense') {
            summary.expense += expense.amount;
        } else if (expense.type === 'income') {
            summary.income += expense.amount;
        }
    });

    return summary;
}

module.exports = {
    getOverviewSummary
}