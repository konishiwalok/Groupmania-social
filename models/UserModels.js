const connectdb = require('../database/db');
const mysql = require('mysql');

class UserModels {
    constructor() {
    }
    signup(sqlInserts){
        let sql = 'INSERT INTO users VALUES(NULL, ?, ?, ?, ?, NULL)';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql, function(err, result){
                if (err) reject({error : 'Erreur dans l\'inscription'});
                resolve({message : 'Nouvel utilisateur !'})
            })
        })
    }}
    
module.exports = UserModels;
