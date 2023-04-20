const { authenticateUser, verifyToken } = require('../services/user/user.service');
const router = require('express').Router();

router.use((req, res, next) => {
    next()
});

/**
 * @POST /login
 * @description authenticate user
 */
router.post('/', async (req, res) => {
    try {
        const result = await authenticateUser(req.body);
        res.json(result);
    } catch (e) {
        res.status(e.status)
            .json(e);
    }
});

/**
 * @POST /login/token
 * @description verify token
 */
router.post('/token', async (req, res) => {
    const token = req.body.token;
    try {
        verifyToken(token);
        res.end();
    } catch (e) {
        res.status(e.status)
            .json(e);
    }
});

module.exports = router;
