require('dotenv').config();
const express = require('express');
const models = require('./models/models')
const sequelize = require('./db');
const cors = require('cors');
const router = require('./routes/index')
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api', router);

//Обработка ошибок
app.use(errorHandler);


const start = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync( {force: true});
        app.listen(PORT, ()=>console.log('Сервер запущен на порту ' + PORT));
    } catch (e) {
        console.log(e);
    }
}
start();
