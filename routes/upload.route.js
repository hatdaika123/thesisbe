const router = require('express').Router();
const HTTP_STATUS = require('http-status');
const { upload } = require('../services/upload/upload.service');


router.use((req, res, next) => {
    next()
});

/**
 * @POST /upload/image
 * @description
 */
router.post('/image', upload.single('file'), (req, res) => {
    const host = req.get('host');
    const filename = req.file.filename;
    const url = `${host}/preview/images/${filename}`
    res.status(HTTP_STATUS.CREATED).json({ url });
});

module.exports = router;