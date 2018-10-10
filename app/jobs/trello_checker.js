const logger = require('../../config/logger')
const cardModel = require('../models/card')
const cardUtilities = require('../utilities/card')

class TrelloChecker {
  perform() {
    // first get all invalid cards from db
    cardModel
      .find({is_valid: false})
      .select('card_id')
      .exec((error, cardIds) => {
      if(error) {
        logger.error(error)
      } else {
        this.handleInvalidCards(cardIds)
      }
    })
  }

  handleInvalidCards(cardIds) {
    cards.forEach(function(cardId) {
      cardUtilities.fetchCard(cardId).then((card) => {
        let rules = this.getRules(card)
        this.executeRules(card, rules)
      }).catch((error) => {
        logger.error(error)
      })
    })
  }

  getRules(card) {
    let rules = [
      'titleWordCount',
      'titleTitleize',
      'descriptionAvailabilty',
      'labels',
      'listOfNewCard'
    ]
    // @todo add the rule of member checking.
  }

  executeRules(card, rules) {
    let result = cardUtilities.executeRules(card, rules, {})

    if(result['ticketValid']) {
      // if ticket is valid, delete the entry from DB.
      cardUtilities.deleteCardDoc(cardId)
    } else {
      this.handleInvalidCard(card, result['errorMessages'])
    }
  }

  handleInvalidCard(card, errorMessages) {
    let titleMsg = '😓 Again!!!!! \n' + card['name'] + ' \n This card still has some unresolved standard issues. Fix it or I will not tired of notifying you! \n '
    let msg = cardUtilities.buildMessage(titleMsg, card, errorMessages)
    new slackPublisher({msg: msg})
  }
}
