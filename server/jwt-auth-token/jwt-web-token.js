var jwt = require('jsonwebtoken');
var fs = require('fs')
const path = require ('path')
var privateKEY  = fs.readFileSync(path.resolve(__dirname,'private.key'),'utf8');
var publicKEY  = fs.readFileSync(path.resolve(__dirname,'public.key'), 'utf8');

function createToken(payload ,expireInDay){
 return jwt.sign(payload, privateKEY,{expiresIn :expireInDay,algorithm:  "RS256"})
}

function verifyToken(req, res) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
    } else {
      // Forbidden
      res.sendStatus(403);
    }
 try {
     var decode = jwt.verify(req.token,publicKEY,{algorithms: ['RS256']})
 } 
 catch (err) {
     console.log(err)
     throw err
 }
 return decode
}
module.exports = {
    createToken:createToken,
    verifyToken:verifyToken
}