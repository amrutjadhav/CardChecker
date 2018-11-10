const logger = require('../../config/logger')
const request = require('request-promise-native')

class Teams {
  constructor(options) {
    this.notify(options)
  }

  notify(options) {
    let msg = options.msg
    if(!msg) {
      logger.error('There is no message to publish to Teams.')
      return
    }

    if(process.env.APP_ENV == 'production') {
      request({
        uri: process.env.TEAMS_WEBHOOK_URL,
        method: 'POST',
        body: {text: msg},
        json: true
      }).then((result) => {
        logger.info('message sent to Teams.')
      }, (error) => {
        logger.error(error)
      }).catch((error) => {
        logger.error(error)
      })
    } else {
      // if environment is other than production, just log the messages.
      logger.info(msg)
    }
  }
}

module.exports = Teams
