const router = require('express').Router();
const HTTP_STATUS = require('http-status');
const { getOverviewSummary } = require('../services/statistic/statistic.service');

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

module.exports = router;