const express = require('express');
const nodemailer = require('nodemailer')
const mysql = require('mysql');
const user = require('./useraction')
const smtpconfig = require('./config/smtpconfig')
const app = express();
bodyParser = require('body-parser');
const dbconfig = require('./config/dbconfig')
const con = require('./conn')
const config = require('./config/config')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


 con.connect(function(err) {
    if (err) throw err;
    console.log("db connected")
  } ) 

user.createTable(con)
var smtpTransport = nodemailer.createTransport(smtpconfig.smtpConfig);

function sendMail(email,userid,token,callback){
    var mailOptions,link;
    console.log(userid +"useridd")
    link = `${config.host}/verify?u=${userid}&tk=${token}`
    mailOptions={
        to : email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    return  smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
           callback(err, null)
        }else{
               console.log("Message sent: " + response.message);
               callback(null,response)
            }
   });

}
app.post ('/verify' , (req, res)=>{
    var userid = req.query.u
    var token = req.query.tk
    console.log("verifytoken")
    console.log(req.query)
    user.verifyToken(userid,token,(err,result)=>{
      if (err) {
          res.status(500).send()
      } else {
          if (result.linkvalidity) {
              res.send ('authentication done')
          } else {
              res.status(403).send("link is expired or invalid")
          }
      }
    })
})
app.post('./resetpassword', (req,res)=>{  
let email= req.body.email
let token = req.body.token
let password = req.body.password
user.verifyTokenusingmail(email, token (err, result)=>{
    if (err) {
        res.status(500).send()
    } else {
        if (!result ) {
            res.status(403).send('password reset link been expired')
        } else {
            user.updatepassword(email,password, (err,result)=>{
                if(err) {
                    res.status(500).send()
                } else {
                   res.send( 'password has been succefully reset')
                }
            })
        }
    }
})
})
app.post('/signup', function (req,res){
    let firstname = req.body.firstname
    let lastname  = req.body.lastname
    let email = req.body.email
   let result =  user.checkUserIndb(email,con,function(err, result){
      if (err){
          console.log(err)
          res.status(500).send();
      } else {
          if (result == null ||result.length == 0) {
              user.adduser(firstname,lastname,email,con,(err, result)=>{
                  if (err) {
                      console.log(err)
                      res.status(500).send();
                  } else {
                       user.getuserbyemailid (email ,(err,result)=>{
                         if (err) {
                             console.log(err)
                         } else 
                         { 
                             userId = result[0].userId
                             token = result[0].vtoken
                            sendMail(email,userId,token, (err,result)=>{
                                console.log("232")
                                if (err) {
                                    console.log(err)
                                    res.status(500).send();
                                } else {
                                    console.log(result)
                                    res.send("confirmation link has been send to your registered mail id ")
                                }
                            }) 
                         }
                       })
                     
                  }
              })
          } else {
              user.getuserbyemailid(email,(err,result)=>{
                  if (err){
                     console.log(err)
                     res.status.send(500)
                  }
                  else {
                     if (result[0].active) {
                         res.send('you have already sign up , if you forget password kindly reset password')
                     } else {
                         res.send("an activation link hsas been send to your register mail id, kinnldy confirm it")
                     }
                  }
                  
              })
          }
      }
   })
    //console.log(result)
    
   
})
app.listen(3000, () => console.log('Server started on port 5000'));
