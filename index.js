require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const eventController = require('./app/controllers/event_controller')
const configurationController = require('./app/controllers/configuration_controller')
const logger = require('./config/logger')
const mongoose = require('mongoose')
const trelloCheckerJob = require('./app/jobs/trello_checker')
const moment = require('moment-timezone')
const commonUtilities = require('./app/utilities/common')

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// trello webhook event
app.post('/', function(req, res) {
  res.send('OK')
  let controller = new eventController()
  controller.trelloEvents(req.body['action'])
})

// subscribe app as trello webhook
app.post('/configure/subscribe/trello/webhook', (req, res) => {
  let controller = new configurationController()
  controller.subscribeTrelloWebhook(req.body).then((result) => {
    res.send(result)
  }, (error) => {
    res.send(error)
  })
})

// @todo this is patch for cron job scheduling. In future use, cron instead!
setInterval(() => {
  let date = moment().tz('Asia/Kolkata')
  let config = commonUtilities.getScopeConfig(undefined)

  if(!config.defaults.weekendDays.includes(date.format('e')) &&
     date >= moment(config.defaults.officeStartHour).tz('Asia/Kolkata') &&
     date <= moment(config.defaults.officeEndHour).tz('Asia/Kolkata')
   ) {
    // don't run checker job on Sunday and Saturday.
    // Also don't run job before 9:00 and after 20:59.
    console.log('running checker job')
    new trelloCheckerJob()
  }
}, config.defaults.checkerJobDelay * 60 * 100)

mongoose.connect('mongodb://' + process.env.DB_URI, {useNewUrlParser: true, useCreateIndex: true})
  .then(() => {
      logger.info('MONGODB CONNECTION SUCCESFULL');
      app.listen(process.env.PORT, () => {
        logger.info('Listening on ' + process.env.PORT)
      })
    }, (err) => {
    logger.error('connection error:', err);
  });
