const { IncomingWebhook } = require('@slack/client')
const url = process.env.SLACK_WEBHOOK_URL
const webhook = new IncomingWebhook(url)
const logger = require('../../config/logger')

class Slack {
  constructor(options) {
    this.notify(options)
  }

  notify(options) {
    let msg = options.msg
    if(!msg) {
      logger.error('There is no message to publish to slack.')
      return
    }
    if(process.env.APP_ENV == 'production') {
      webhook.send(msg, function(err, res) {
        if (err) {
          logger.error('Error:', err)
        } else {
          logger.info('Message sent on slack channel')
        }
      })
    } else {
      // if environment is other than production, just log the messages.
      logger.info(msg)
    }
  }
}

module.exports = Slack
