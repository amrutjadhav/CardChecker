const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)
const logger = require('../../config/logger')
const cardModel = require('../models/card')
const slackPublisher = require('../publishers/slack')
const teamsPublisher = require('../publishers/teams')
const flockPublisher = require('../publishers/flock')

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
      let cardDocument = new cardModel({ card_id: card.id })
      cardDocument.save((error, doc) => {
        if(error) {
          reject(error)
        }
        resolve()
      })
    })
  },

  /**
   * Check if a specified label is present on card or not.
   * @param  {Object}  card Trello card Object.
   * @param {String} labelName Name of label which you want to check on card.
   * @return {Boolean} Whether label is present or not?
   */
  checkLabel: (card, labelName) => {
    let labelNameRegex = new RegExp(labelName)
    let labelPresent = false
    card.labels.forEach((labelObject) => {
      let name = labelObject.name.toLowerCase()
      if(name.match(labelNameRegex)) {
        labelPresent = true
      }
    })
    return labelPresent
  },

  executeRules: (card, rules, options) => {
    let ticketValid = true
    let errorMessages = []
    let cardRules = require('../rules/card')
    rules.forEach(function(rule) {
      // Check if rule is present or not.
      if(cardRules[rule]) {
        let result = cardRules[rule](card, options)
        if(!result['success']) {
          ticketValid = false
          errorMessages.push(result['msg'])
        }
      } else {
        logger.error('Rule not found:', rule)
      }
    })
    return {ticketValid: ticketValid, errorMessages: errorMessages}
  },

  notifyErrors: (title, card, errorMessages, publisher) => {
    let msg = title + '\n'
    errorMessages.forEach((error) => {
      msg += '- ' + error + '\n'
    })
    msg +=  '\n' + card['shortUrl']

    // Send message to configured publisher
    switch(publisher) {
    case 'slack':
      new slackPublisher({msg: msg})
      break
    case 'teams':
      new teamsPublisher({msg: msg})
      break
    case 'flock':
      new flockPublisher({msg: msg})
      break
    default:
      logger.error(msg)
    }
  }
}

module.exports = cardUtilities
