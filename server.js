require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./middlewares/authenticate.middleware');
const signup = require('./routes/signup.route');
const login = require('./routes/login.route');
const category = require('./routes/category.route');
const upload = require('./routes/upload.route');
const preview = require('./routes/preview.route');
const expense = require('./routes/expense.route');
const statistic = require('./routes/statistic.route');
const { ErrorDTOBuilder } = require('./dto/error.dto');
const multer = require('multer');
const HTTP_STATUS = require('http-status');
/**
 * @description connect mongodb
 */
mongoose.set('strictQuery', false);
const connection = mongoose.connect(process.env.DATASOURCE_URL, () => console.log("DB Connected!"));

/**
 * @description middleware
 */
app.use(cors());
app.use(express.json());


/**
 * @description routes
 */
app.use('/signup', signup);
app.use('/login', login);
app.use('/category', auth, category);
app.use('/upload', auth, upload);
app.use('/preview', preview);
app.use('/expense', auth, expense);
app.use('/statistic', auth, statistic);

/**
 * @description handling error
 */
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const e = new ErrorDTOBuilder()
            .setStatus(HTTP_STATUS.BAD_REQUEST)
            .setMessage(err.code)
            .build();
        return res.status(e.status)
            .json(e);
    } else if (err) {
        const e = new ErrorDTOBuilder()
            .setStatus(HTTP_STATUS.BAD_REQUEST)
            .setMessage(err.message)
            .build();
        return res.status(e.status)
            .json(e);
    }

    next();
});


app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));