const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)
const cardRules = require('../rules/card')
const logger = require('../../config/logger')
const cardModel = require('../models/card')

const cardUtilities = {

  fetchCard: (cardId) => {
    return trello.makeRequest('get', '/1/cards/' + cardId, {webhooks: true})
  },

  deleteCardDoc: (cardId) => {
    cardModel.findOneAndDelete({card_id: cardId}, (error, doc) => {
      if(error) {
        logger.error(error)
      }
    })
  },

  createCardDoc: (card) => {
    return new Promise((resolve, reject) => {
      let cardDocument = new cardModel({ card_id: card['id'] })
      cardDocument.save((error, doc) => {
        if(error) {
          reject(error)
        }
      })
    })
  },

  executeRules: (card, rules, options) => {
    let ticketValid = true
    let errorMessages = []
    rules.forEach(function(rule) {
      // @todo add method check here
      let result = cardRules[rule](card, options)
      if(!result['success']) {
        ticketValid = false
        errorMessages.push(result['msg'])
      }
    })
    return {ticketValid: ticketValid, errorMessages: errorMessages}
  },

  buildMessage(card, titleMsg, errorMessages) {
    let msg = titleMsg
    errorMessages.forEach((error) => {
      msg += '- ' + error + '\n'
    })
    msg +=  card['shortUrl']
    return {
      text: msg
    }
  }
}

module.exports = cardUtilities
