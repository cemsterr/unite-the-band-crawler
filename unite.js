const express = require('express');
const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');
const gmailer = require('./mailer-gmail');
const friendMailer = require('./to-ignore/mailer-friends');

const port = process.env.PORT || 4567;
const url = 'http://www.unitetheband.com/unite-the-stage-2/';
const queryString = 'Başvurular çok yakında';
let isFormAnnounced = false;

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
  socket.on('start scraping', function() {
    if (isFormAnnounced === false) {
      let scrapeStatus = scrape(url);
      console.log('The form is not announced yet')
    } else {
      console.log('The form is announced')
    }
  });
  socket.on('stop scraping', function() {
    console.log('I\'m done scraping.')
  });
  
});

let scrape = (url) => {
  rp(url)
  .then(function (html) {
    if (html.indexOf(queryString) !== -1) {
      console.log('Nothing yet, champ')
    } else {
      console.log('RUSH B');
      isFormAnnounced = true;
      gmailer.sendInformationMail();
      console.log('This should be done!');
    }      
  })
  .catch(function (err) {
    console.log('Something went wrong');
    console.log(err);
  })
  .finally(function () {
    io.emit('scrape status', isFormAnnounced);
    return isFormAnnounced;
  })
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/mail-me', (req, res) => {
  gmailer.sendInformationMail();
  res.send('I think I sent the e-mail to you!');
})

app.get('/mail-friends', (req, res) => {
  friendMailer.sendInformationMail();
  res.send('I think I sent the e-mail to your friends!');
})

http.listen(port, () => {
  console.log(`Magic happens on port ${port}`);  
});

exports = module.exports = app;
