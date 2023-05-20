const router = require('express').Router();
const HTTP_STATUS = require('http-status');
const { getOverviewSummary, getStatistic, getLineStatistic } = require('../services/statistic/statistic.service');

router.use((req, res, next) => {
    next()
});

/**
 * @GET /statistic/summary
 * @description get overview sumary of total expense and  income
 */
router.get('/summary', async (req, res) => {
    const principal = req.principal;
    const summary = await getOverviewSummary(principal);
    res.status(HTTP_STATUS.OK)
        .json(summary);
});

/**
 * @GET /statistic/line
 * @description get data for line chart
 */
router.get('/line', async (req, res) => {
    const principal = req.principal;
    const data = await getLineStatistic(principal, req.query);
    res.status(HTTP_STATUS.OK)
        .json(data);
});

/**
 * @GET /statistic
 * @description get data for rendering pie chart
 */
router.get('/', async (req, res) => {
    const principal = req.principal;
    const expenses = await getStatistic(principal, req.query);
    res.json(expenses);
});

module.exports = router;