require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const mongoose = require('mongoose');
const signup = require('./routes/signup');
const login = require('./routes/login');

/**
 * @description connect mongodb
 */
mongoose.set('strictQuery', false);
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.DATASOURCE_URL, () => console.log("DB Connected!"));
}

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


app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));