const { updateExpense, saveExpense, getExpenses, getExpenseById, deleteExpense } = require('../services/expense/expense.service');

const router = require('express').Router();
const HTTP_STATUS = require('http-status');

router.use((req, res, next) => {
    next()
});

/**
 * @GET /expense
 * @description get expenses
 */
router.get('/', async (req, res) => {
    const principal = req.principal;
    const query = req.query;
    const result = await getExpenses(principal, query);
    
    res.status(HTTP_STATUS.OK)
        .json({
            data: result.data,
            currentPage: parseInt(req.query.page) || 0,
            pageSize: parseInt(req.query.pageSize) || 20,
            total: result.total
        });
});

/**
 * @GET /expense/:expenseId
 * @description get expense by id
 */
router.get('/:expenseId', async(req, res) => {
    try {
        const expense = await getExpenseById(req.params.expenseId);
        res.json(expense);
    } catch (e) {
        res.status(e.status)
            .json(e);
    }
});

/**
 * @POST /expense
 * @description save expense
 */
router.post('/', async (req, res) => {
    const expense = req.body;
    const principal = req.principal;
    if (expense._id) {
        try {
            await updateExpense(expense);
            res.status(HTTP_STATUS.OK)
                .end();
        } catch (e) {
            res.status(e.status)
                .json(e);
        }
    } else {
        await saveExpense(expense, principal);
        res.status(HTTP_STATUS.CREATED)
            .end();
    }
});

/**
 * @DELETE /expense/:expenseId
 * @description delete expense by id
 */
router.delete('/:expenseId', async (req, res) => {
    const principal = req.principal;
    try {
        await deleteExpense(req.params.expenseId, principal);
        res.status(HTTP_STATUS.OK)
            .end();
    } catch (e) {
        res.status(e.status)
            .json(e);
    }
});

module.exports = router;