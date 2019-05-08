const mysql = require('mysql')
const con = require('./conn')
const bcrypt = require('bcrypt')

checkUserIndb = (email, con, callback) => {
    let result;
    query = `select emailid from user where emailid ="${email}"`
    return con.query(query, (err, result) => {
        if (err) {
            callback(err, null)
        }
        callback(null, result)
    })
    //   con.query(query, (err,res)=>{

}

createTable = function (con) {
    let sql = `CREATE TABLE IF NOT EXISTS user (
userId int(11) not null auto_increment,
firstname varchar(255) not null,
lastname varchar(255) not null,
emailid varchar(255) not null unique,
active boolean default false,
password  varchar(255),
vtoken varchar(255),
primary key (userId)
)`
    return con.query(sql, (err, res) => {
        if (err) {
            console.log(err)
        } else {

            console.log('table_create succesfully')
        }
    })
}
var adduser = (firstname, lastname, email, con, callback) => {
    var time = Math.floor(Date.now() / 10000);
    var vtoken = time + Math.random().toString(36).substring(1);
    var addquery = `insert into user (firstname, lastname, emailid, vtoken,password) values("${firstname}", "${lastname}", "${email}","${vtoken}",null)`
    return con.query(addquery, function (err, res) {
        if (err) {
            callback(err, res)
        } else {
            callback(null, res)
        }
    })
}

var statusofuser = (email, callback) => {
    var statusquery = `select active from user where emailid ="${email}"`
    return con.query(query, (err, result) => {
        if (error) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}

var updatepassword = (userid, password, callback) => {
    var hash = bcrypt.hashSync(password , 2);
    let qry = `update user set password = "${hash}" where userid ="${userid}"`
    return con.query(qry, (err, result) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}
var passwordcheck = (email, password, callback)=>{
  let getpasswordquery = `select password from user where emailid ="${email}"`
  con.query(getpasswordquery, (err, result)=>{
      if(err){
          callback(err, null)
      } else {
           hash = result[0].password
          let match =bcrypt.compareSync(password, hash)
          callback(null, match)
      }
  })
}
var getuserbyemailid = (email, callback) => {
    let getquery = `select * from user where emailid ="${email}"`
    //  let getquery = `select firstname, active from user where emailid =${email}`
    return con.query(getquery, (err, result) => {
        if (err) {
            console.log(err)
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}
var getuserbyuserid = (userId, callback) => {
    let getquery = `select * from user where userId =${userId}`
    return con.query(getquery, (err, result) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}
var verifyToken = (userid, token, callback) => {
    return getuserbyuserid(userid, (err, res) => {
        if (err) {
            callback(err, res)
        } else {
            vtoken = res[0].vtoken
            console.log(vtoken)
            if (vtoken == token) {
                return activateaccount(userid, (err, result) => {
                    if (err) {
                        callback(err, result)
                    } else {
                        result.linkvalidity = true
                        callback(null, result)
                    }
                })
            } else { 
                callback(null,{linkvalidity :false})
            }
        }
    })
}
var activateaccount = (userid, callback) => {
    let updatequery = `update user set active = true where userId =${userid}`
    return con.query(updatequery, (err, res) => {
        if (err) {
            callback(err, res)
        } else {
            callback(null, res)
        }
    })
}
var verifyTokenusingmail = (email, token, callback)=>{
    let gettokenquery = `select vtoken from user where emailid ="${email}"`
    return con.query(gettokenquery, (err, result)=>{
        if (err) {
            callback(err, null)
        } else {
            vtoken = result[0].vtoken
            console.log(token)
            console.log(vtoken)
            if (vtoken == token ) {
                let match  = true
                callback (null ,match)
            } else {
                let match = false
                callback(null, match)
            }
        }
    })
}
module.exports = {
    checkUserIndb: checkUserIndb,
    createTable: createTable,
    adduser: adduser,
    getuserbyemailid: getuserbyemailid,
    verifyToken: verifyToken,
    verifyTokenusingmail:verifyTokenusingmail,
    updatepassword:updatepassword,
    passwordcheck:passwordcheck
}