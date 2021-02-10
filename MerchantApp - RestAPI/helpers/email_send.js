const nodemailer = require('nodemailer');
var pug = require('pug');

const sendEmail = (token,encrypt_email,firstName,sendEmail,type="register")=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      // compile
    
    var locals={ pageTitle:"Welcome | Infy Origin",firstName:firstName}
    var subject = "Welcome to Infy Origin"
    if(type==="forgotPassword"){
        locals.pageTitle = "Forgot Password | Infy Origin"
        var url = `${process.env.RESTPASSWORD_URI}${token}/${encrypt_email}`
        locals.url = url
        var subject = "REST PASSWORD - INFY ORIGIN"
        var html = pug.renderFile('./email_template/forgotPassword.pug', locals);
    }else{
        var url = `${process.env.VERIFICATION_URI}${token}/${encrypt_email}`
        locals.url = url
        var html = pug.renderFile('./email_template/emailTemplate.pug', locals);
    }
  
    var mailOptions = {
        from: process.env.EMAIL,
        to: sendEmail,
        subject: subject,
        html: html
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}  
  
module.exports = sendEmail