const mysql = require('mysql');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({

    host: 'DB_HOST',
    user: 'DB_USER',
    password: 'DB_PASSWORD',
    database: 'database_development_mania',
    dialect: "mysql"

});
const db = {};
try {
    db;
    console.log('connect to the dataBase!');
} catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;