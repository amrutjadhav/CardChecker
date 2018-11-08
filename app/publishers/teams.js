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
      let cardJSON = this.connectorCardJSON(msg)
      request({
        uri: process.env.TEAMS_WEBHOOK_URL,
        method: 'POST',
        body: cardJSON,
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

  connectorCardJSON(msg) {
    return {
      "contentType": "application/vnd.microsoft.teams.card.o365connector",
      "content": {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "summary": "Summary",
        "title": "Connector Card HTML formatting",
        "sections": [
          {
            'text': msg
          }
        ]
      }
    }
  }
}

module.exports = Teams
