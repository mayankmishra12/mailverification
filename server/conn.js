const dbconfig = require('./config/dbconfig')
const mysql = require('mysql')
module.exports = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.dbname
  });

 
