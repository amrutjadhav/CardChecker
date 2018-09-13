const { IncomingWebhook } = require('@slack/client')
const url = process.env.SLACK_WEBHOOK_URL
const webhook = new IncomingWebhook(url)

class Slack {
  constructor(options) {
    this.notify(options)
  }

  notify(options) {
    let msg = options['msg']

    webhook.send(msg, function(err, res) {
      if (err) {
        console.log('Error:', err)
      } else {
        console.log('Message sent: ', res)
      }
    })
  }
}

module.exports = Slack
