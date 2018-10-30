const logger = require('../../config/logger')
const msgTemplate = require('../message_template')
const request = require('request-promise-native')

class ConfigurationController {
  subscribeTrelloWebhook(params) {
    return new Promise((resolve, reject) => {
      let validation = this.validateSubscribeTrelloWebhook(params)
      if(!validation.requestValid) {
        reject(validation)
        return
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
          resolve({result: 'webhook subscribed'})
        }, (error) => {
          logger.error(error.response.body)
          reject({result: error.response.body})
        })
        .catch((error) => {
          logger.error(error.response.body)
          reject({result: error.response.body})
        })
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
