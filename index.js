require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const eventHandler = require('./app/event_handler')
const logger = require('./config/logger')
const mongoose = require('mongoose')
// const cron = require('node-cron');
const trelloCheckerJob = require('./app/jobs/trello_checker')
// const request = require('request-promise-native')

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// post trello webhook
app.post('/', function(req, res) {
  res.send('OK')
  new eventHandler(req.body['action'])
})

// schedule cron for ticket checker
// cron.schedule('* 25 * * * *', () => {
//   new trelloCheckerJob()
//   console.log('running a task every 25 minutes');
// });

// @todo this is patch for cron job scheduling. In future use, cron instead!
setInterval(() => {
  console.log('running checker job')
  let date = new Date()
  if(![0, 6].includes(date.getDay()) && date.getHours() >= 9 && date.getHours() <= 20) {
    // don't run checker job on Sunday and Saturday.
    // Also don't run job before 9:00 and after 20:59.
    new trelloCheckerJob()
  }
}, (25*60*1000))

mongoose.connect('mongodb://' + process.env.DB_URI, {useNewUrlParser: true, useCreateIndex: true})
  .then(() => {
      logger.info('MONGODB CONNECTION SUCCESFULL');
      app.listen(process.env.PORT, () => {
        logger.info('Listening on 3000')
      })
    }, (err) => {
    logger.error('connection error:', err);
  });


// Webhook request for trello. Use it for first time when you subscribing the webhook.
// request({
//   uri: 'https://api.trello.com/1/tokens/' + process.env.TRELLO_TOKEN + '/webhooks/?key=' + process.env.TRELLO_KEY,
//   method: 'POST',
//   body: {
//     description: 'TicketChecker webhook',
//     idModel: process.env.TRELLO_MODEL_ID,
//     callbackURL: process.env.TRELLO_CALLBACK_URL
//   },
//   json: true
// })
// .then((result) => {
//   logger.info('webhook subscribed')
// })
// .catch((error) => {
//   logger.error(error)
// })
