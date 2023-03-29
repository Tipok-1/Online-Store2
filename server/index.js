require('dotenv').config();
const express = require('express');
const models = require('./models/models')
const sequelize = require('./db');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).json({message:'work'});
})

const start = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, ()=>console.log('Сервер запущен на порту ' + PORT));
    } catch (e) {
        console.log(e);
    }
}
start();
