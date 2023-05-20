const moment = require('moment');
const { Expense } = require("../../models/expense/expense.model");
const mongoose = require('mongoose');

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

/**
 * 
 * @param {{ username: String, _id: String, iat: Number, exp: Number }} user 
 * @param {{ date: 'date' | 'week' | 'month' | 'year', type: 'expense' | 'income'}} query
 * @returns { Expense[] } expenses
 */
async function getStatistic(user, query) {
    const type = query.type || 'expense';
    const date = query.date || 'date';
    const dateQuery = buildDateQuery(date);
    
    const expenses = await Expense
        .find({
            userId: user._id,
            type,
            ...dateQuery
        })
        .select('categoryId amount');
    
    return expenses;
}

/**
 * 
 * @param { String } type
 * @returns {{ [key: string]: Object }} query 
 */
function buildDateQuery(type) {
    let from;
    let to;
    switch (type) {
        case 'week':
            from = moment().startOf('week').toDate();
            to = moment().endOf('week').toDate();
            break;
        case 'month':
            from = moment().startOf('month').toDate();
            to = moment().endOf('month').toDate();
            break;
        case 'year':
            from = moment().startOf('year').toDate();
            to = moment().endOf('year').toDate();
            break;
        default:
            from = moment().startOf('day').toDate();
            to = moment().endOf('day').toDate();
            break;
    }

    return ({
        date: {
            $gte: from,
            $lt: to
        }
    });
}

/**
 * 
 * @param {{ username: String, _id: String, iat: Number, exp: Number }} user 
 * @param {{ date: 'date' | 'week' | 'month' | 'year', type: 'expense' | 'income'}} query
 * @returns stats
 */
async function getLineStatistic(user, query) {
    const type = query.type || 'expense';
    const date = query.date || 'date';
    const dateQuery = buildDateRangeQuery(date);
    let group;
    switch (date) {
        case 'week':
            group = { $week: "$date" }
            break;
        case 'month':
            group = { $month: "$date" }
            break;
        case 'year':
            group = { $year: "$date" }
            break;
        default:
            group = { $dayOfMonth: "$date" }
    }

    const stats = await Expense.aggregate([
        {
            $match: {
                userId: mongoose.Types.ObjectId(user._id),
                type: type,
                ...dateQuery
            }
        },
        {
            $group: {
                _id: group,
                data: { $sum: "$amount" },
            },
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    return stats;
}

/**
 * 
 * @param { String } type
 * @returns {{ [key: string]: Object }} query 
 */
function buildDateRangeQuery(type) {
    let from;
    let to;
    switch (type) {
        case 'week':
            from = moment().startOf('week').subtract(6, 'week').toDate();
            to = moment().endOf('week').toDate();
            break;
        case 'month':
            from = moment().startOf('year').toDate();
            to = moment().endOf('year').toDate();
            break;
        case 'year':
            from = moment().startOf('year').subtract(1, 'year').toDate();
            to = moment().endOf('year').toDate();
            break;
        default:
            from = moment().startOf('day').subtract(6, 'day').toDate();
            to = moment().endOf('day').toDate();
            break;
    }

    return ({
        date: {
            $gte: from,
            $lt: to
        }
    });
}

module.exports = {
    getOverviewSummary,
    getStatistic,
    getLineStatistic
}