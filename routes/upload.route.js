const router = require('express').Router();
const HTTP_STATUS = require('http-status');
const { upload, generateUrlsFromFilesWithHost } = require('../services/upload/upload.service');


router.use((req, res, next) => {
    next()
});

/**
 * @POST /upload/image
 * @description
 */
router.post('/image', upload.array('files'), (req, res) => {
    const host = req.get('host');
    const urls = generateUrlsFromFilesWithHost(req.files, host);
    res.status(HTTP_STATUS.CREATED).json(urls);
});

module.exports = router;