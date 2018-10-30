const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)
const logger = require('../../config/logger')
const cardModel = require('../models/card')

const cardUtilities = {

  fetchCard: (cardId, options) => {
    let endPointOptions = Object.assign({webhooks: true}, options)
    return trello.makeRequest('get', '/1/cards/' + cardId, endPointOptions)
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
        resolve()
      })
    })
  },

  /**
   * Get the card category eg. development, other
   * Category helps to decide which rule should be applied to card.
   * Support categories - development, other
   * Default category is set to `development`.
   * @param  {Object}  card Trello card Object.
   * @return {String} Category of card
   */
  getCardCategory: (card) => {
    // Currently to check whether card is dev or not, it only check the label naming 'development'.
    // @todo make this configurable.
    let labels = card.labels
    let category = 'development'

    labels.forEach((labelObject) => {
      let name = labelObject.name.toLowerCase()
      if(name.match(/^.*non\sdev.*$/)) {
        category = 'other'
      }
    })
    return category
  },

  executeRules: (card, rules, options) => {
    let ticketValid = true
    let errorMessages = []
    const cardRules = require('../rules/card')
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
