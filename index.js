const express = require('express')
const app = express()
const eventHandler = require('./app/event_handler')
const request = require('request-promise-native')
const log4js = require('log4js').getLogger()

const trelloWebhookOptions =

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// post trello webhook
app.post('/', function(req, res) {
  let body = ''
  req.on('data', (data) => {
    body = JSON.parse(data.toString())
  });
  req.on('end', () => {
    new eventHandler(body['action'])
    res.end('ok');
  });
})

app.listen(8080, () => {
  console.log('Listening on 3000')

  request({
    uri: 'https://api.trello.com/1/tokens/' + process.env.TRELLO_TOKEN + '/webhooks/?key=' + process.env.TRELLO_KEY
    method: 'POST',
    body: {
      description: 'Hiveszone webhook',
      idModel: process.env.MODEL_ID
      callbackURL: process.env.TRELLO_CALLBACK_URL
    },
    json: true
  })
  .then((result) => {
    log4js.info('webhook subscribed')
  })
  .catch((error) => {
    log4js.error(error)
  })
})
