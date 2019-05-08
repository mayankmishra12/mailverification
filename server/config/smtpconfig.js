
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user : 'mayanksiliguri@gmail.com',
        pass :'Myk@1234' 
    }
};
module.exports = {
    smtpConfig:smtpConfig
}
