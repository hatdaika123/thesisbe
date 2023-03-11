const { getAllCategory, getCategoryById, saveCategory } = require('../services/category/category.service');
const router = require('express').Router();
const HTTP_STATUS = require('http-status');

router.use((req, res, next) => {
    next()
});

/**
 * @GET /category
 * @description list categories
 */
router.get('/', async (req, res) => {
    const categories = await getAllCategory(req.principal);
    res.status(HTTP_STATUS.OK)
        .json(categories);
});

/**
 * @GET /category/:categoryId
 * @description get single category by Id
 */
router.get('/:categoryId', async (req, res) => {
    try {
        const category = await getCategoryById(req.params.categoryId);
        res.json(category);
    } catch (e) {
        res.status(e.status)
            .json(e);
    }
});

/**
 * @POST /category
 * @description save category
 */
router.post('/', async (req, res) => {
    const category = req.body;
    const principal = req.principal;
    await saveCategory(category, principal);
    res.status(HTTP_STATUS.CREATED)
        .end();
});

module.exports = router;