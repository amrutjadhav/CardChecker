const cardModel = require('../models/card')
const logger = require('../../config/logger')
const cardUtilities = require('../utilities/card')
const commonUtilities = require('../utilities/common')

class TrelloChecker {

  constructor() {
    this.perform()
  }

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
    let cardApiOptions = {
      attachments: true,
      list: true,
      checklists: 'all'
    }
    cardIds.forEach((doc) => {
      cardUtilities.fetchCard(doc.card_id, cardApiOptions).then((card) => {
        let rules = this.getRules(card)
        this.executeRules(card, rules)
      }).catch((error) => {
        logger.error(error)
      })
    })
  }

  getRules(card) {
    let config = commonUtilities.getScopeConfig(card.idBoard)
    let rules = config.cardRules

    // push rules of individual list.
    let cardList = card.list.name.toLowerCase()
    rules = rules.concat(config.listRules[cardList])

    return rules
  }

  executeRules(card, rules) {
    let result = cardUtilities.executeRules(card, rules, {})

    if(result.ticketValid) {
      // if ticket is valid, delete the entry from DB.
      cardUtilities.deleteCardDoc(card.id)
    } else {
      this.handleInvalidCard(card, result.errorMessages)
    }
  }

  handleInvalidCard(card, errorMessages) {
    let config = commonUtilities.getScopeConfig(card.idBoard)
    cardModel.findOne({card_id: card.id}, (error, doc) => {
      if(error) {
        logger.info(error)
      } else if(doc) {
        doc.warning_count += 1
        doc.save((error, doc) => {
          if(error) {
            logger.info(error)
          } else {
            let titleMsg = '😓 Again!!!!! \n *' + card.name + '* \n This card still has some unresolved standard issues. \
                            Fix it or I will not tired of notifying you! \n \
                            Warning number - ' + doc.warning_count + ' \n'
            cardUtilities.notifyErrors(titleMsg, card, errorMessages, config.defaults.messagePublisher)
          }
        })
      } else {
        // If doc don't found just log this info
        logger.error('card document doesn\'t found in DB. card-id' + card.id)
      }
    })
  }
}
module.exports = TrelloChecker
