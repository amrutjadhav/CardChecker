const { IncomingWebhook } = require('@slack/client')
const url = process.env.SLACK_WEBHOOK_URL
const webhook = new IncomingWebhook(url)
const logger = require('./config/logger')

class Slack {
  constructor(options) {
    this.notify(options)
  }

  notify(options) {
    let msg = options['msg']

    webhook.send(msg, function(err, res) {
      if (err) {
        logger.error('Error:', err)
      } else {
        logger.info('Message sent: ', res)
      }
    })
  }
}

module.exports = Slack
