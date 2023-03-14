const jwt = require('jsonwebtoken');
const { ErrorDTOBuilder } = require('../dto/error.dto');
const HTTP_STATUS = require('http-status');
const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        const e = new ErrorDTOBuilder()
            .setStatus(HTTP_STATUS.FORBIDDEN)
            .setMessage('Token required.')
            .build();
        res.status(e.status).json(e);
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_PRIVATE_KEY);
        req.principal = decoded;
    } catch (err) {
        const e = new ErrorDTOBuilder()
            .setStatus(HTTP_STATUS.UNAUTHORIZED)
            .setMessage('Invalid token.')
            .build();
        res.status(e.status).json(e);
        return;
    }

    return next();
}

module.exports = verifyToken;