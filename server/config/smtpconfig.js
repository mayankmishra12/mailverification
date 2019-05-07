
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user : 'xyz@gmail.com',
        pass :'xyz' 
    }
};
module.exports = {
    smtpConfig:smtpConfig
}
