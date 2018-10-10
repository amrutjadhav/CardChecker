require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const eventHandler = require('./app/event_handler')
const logger = require('./config/logger')
const mongoose = require('mongoose')
const cron = require('node-cron');
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
cron.schedule('* 25 * * *', () => {
  new trelloCheckerJob()
  console.log('running a task every 25 minutes');
});


app.listen(process.env.PORT, () => {
  logger.info('Listening on 3000')

  // connect mongodb instance

  mongoose.connect('mongodb://' + process.env.DB_URI, {useNewUrlParser: true, useCreateIndex: true}
  ).then(() => {
    logger.info('MONGODB CONNECTION SUCCESFULL');
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
})
