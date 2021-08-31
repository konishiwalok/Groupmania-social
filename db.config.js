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





// const mysql = require("mysql");
// const Sequelize = require("sequelize")
// require('dotenv').config();
// const dbConnection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.database_development_groupmania ,
// });

// dbConnection.connect((error) => {
//   if (error) {
//     console.log("connection error is :" + error);
//     return;
//   }
//   console.log("dbconnection is okey!");
// });

// module.exports = dbConnection;


// database: process.env.DB_DATABASE,