const nodemailer = require('nodemailer');
const config = require('./config');

exports.sendInformationMail = () => {
  // create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.user,
      pass: config.pass
    }
  });
  
  // NB! No need to recreate the transporter object. You can use
  // the same transporter object for all e-mails
  
  // setup e-mail data with unicode symbols
  const mailOptions = {
    from: 'Baba Baband ✔ <bababaand@konserekayit.com>', // sender address
    to: 'cemsaglam@sabanciuniv.edu, ', // list of receivers
    subject: 'Unite The Stage vakti geldi! ✔', // Subject line
    text: 'Unite the stage sitesine kayıt olma vakti geldi! http://www.unitetheband.com/unite-the-stage-2/ linkine gidip kayıt yapın!', // plaintext body
    html: '<p><b>Unite the stage</b>  sitesine kayıt olma vakti geldi! </p>' + 
    '<a href="http://www.unitetheband.com/unite-the-stage-2/">http://www.unitetheband.com/unite-the-stage-2/</a> sitesine' + 
    ' gidip kayıt yaptırabilirsiniz!' // html body
  };
  
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    
  });
}
