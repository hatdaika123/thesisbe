const router = require('express').Router();
const HTTP_STATUS = require('http-status');
const { registerUser } = require('../services/user/user.service');

router.use((req, res, next) => {
    next()
});

/**
 * @POST /signup
 * @description register new user
 */
router.post('/', async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.status(HTTP_STATUS.CREATED)
            .json(result);
    } catch (e) {
        res.status(e.status)
            .json(e);
    }
});

module.exports = router;