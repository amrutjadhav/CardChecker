const logger = require('../../config/logger')
const msgTemplate = require('../message_template')
const request = require('request-promise-native')

class ConfigurationController {
  subscribeTrelloWebhook(params) {
    let validation = this.validateSubscribeTrelloWebhook(params)
    if(!validation.requestValid) {
      return validation
    }
    request({
      uri: 'https://api.trello.com/1/tokens/' + process.env.TRELLO_TOKEN + '/webhooks/?key=' + process.env.TRELLO_KEY,
      method: 'POST',
      body: {
        description: params.description,
        idModel: params.idModel,
        callbackURL: process.env.TRELLO_CALLBACK_URL
      },
      json: true
    })
    .then((result) => {
      return {result: 'webhook subscribed'}
    })
    .catch((error) => {
      logger.error(error)
      return {result: 'error while subscribing webhook on trello.'}
    })
  }

  validateSubscribeTrelloWebhook(params) {
    if(!params.description)
      return {requestValid: false, description: msgTemplate.controllers.configuration.validation.subscribeTrelloWebhook.descriptionRequired}
    if(!params.idModel)
      return {requestValid: false, description: msgTemplate.controllers.configuration.validation.subscribeTrelloWebhook.idModelRequired}
    return {requestValid: true}
  }
}

module.exports = ConfigurationController
