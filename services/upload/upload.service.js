const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const MAX_FILE_SIZE_LIMIT = 16 * 1024 * 1024; // 16MB
const storage = new GridFsStorage({ 
    url: process.env.DATASOURCE_URL,
    file: (req, file) => {
        if (isImage(file.mimetype)) {
            return {
                bucketName: 'images',
                filename: generateFileName(file)
            }
        } else {
            return null;
        }
    }
});
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE_LIMIT,
    }
});

/**
 * 
 * @param { String } mimetype
 * @returns { String[] | Boolean } [type, extension]
 */
function splitMimetype(mimetype) {
    if (!mimetype) return false;
    const result = mimetype.split('/');
    if (result.length < 2) return false;
    return result;
}

/**
 * 
 * @param {String} mimetype
 * @returns {Boolean}
 */
function isImage(mimetype) {
    let part = splitMimetype(mimetype);
    if (!part) return false;
    if (part[0] !== 'image') return false;
    return true;
}

/**
 * 
 * @param {File} file 
 * @returns {String} 
 */
function generateFileName(file) {
    let part = splitMimetype(file.mimetype);
    if (!part) return crypto.randomUUID();
    return `${crypto.randomUUID()}.${part[1]}`;
}

/**
 * 
 * @param {File[]} files
 * @param {String} host
 * @returns {String[]} urls 
 */
function generateUrlsFromFilesWithHost(files, host) {
    return files.map(file => {
        return `${host}/preview/images/${file.filename}`
    });
}

module.exports = {
    upload,
    storage,
    generateUrlsFromFilesWithHost
}