const router = require('express').Router();
const HTTP_STATUS = require('http-status');
const { ErrorDTOBuilder } = require('../dto/error.dto');
const mongoose = require('mongoose');

router.use((req, res, next) => {
    next()
});

let gfs;
const conn = mongoose.createConnection(
    process.env.DATASOURCE_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'images'
    });
});

/**
 * @GET /preview/images/:filename
 * @description live view image by name
 */
router.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    gfs.find({ filename })
        .toArray((err, files) => {
            if (!files || !files.length) {
                const e = new ErrorDTOBuilder()
                    .setMessage('File not found.')
                    .setStatus(HTTP_STATUS.NOT_FOUND)
                    .build();
                return res.status(e).json(e);
            }

            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
});

module.exports = router;