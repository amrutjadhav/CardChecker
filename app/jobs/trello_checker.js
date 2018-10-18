const logger = require('../../config/logger')
const cardModel = require('../models/card')
const cardUtilities = require('../utilities/card')
const slackPublisher = require('../publishers/slack')

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
      list: true
    }
    cardIds.forEach((doc) => {
      cardUtilities.fetchCard(doc['card_id'], cardApiOptions).then((card) => {
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
      'labels'
    ]
    let cardList = card['list']['name'].toLowerCase()

    if(cardList == 'in progress') {
      rules.push('inProgressListMembersRequired', 'dueDate')
    }
    if(cardList == 'in review' && card['idChecklists'].length > 0) {
      rules.push('checkListItemStateCompletion')
    }
    if(cardList == 'in review') {
      rules.push('checkPullRequestAttachment')
    }
    return rules
  }

  executeRules(card, rules) {
    let result = cardUtilities.executeRules(card, rules, {})

    if(result['ticketValid']) {
      // if ticket is valid, delete the entry from DB.
      cardUtilities.deleteCardDoc(card['id'])
    } else {
      this.handleInvalidCard(card, result['errorMessages'])
    }
  }

  handleInvalidCard(card, errorMessages) {
    cardModel.findOne({card_id: card['id']}, (error, doc) => {
      if(error) {
        logger.info(error)
      } else {
        let warningCount = doc['warning_count'] + 1
        doc.update({$inc: {warning_count: 1}}, (error) => {
          if(error) {
            logger.info(error)
          } else {
            let titleMsg = '😓 Again!!!!! \n' + card['name'] + ' \n This card still has some unresolved standard issues. \
                            Fix it or I will not tired of notifying you! \n \
                            Warning number - ' + warningCount + ' \n'
            let msg = cardUtilities.buildMessage(card, titleMsg, errorMessages)
            new slackPublisher({msg: msg})
          }
        })
      }
    })
  }
}
module.exports = TrelloChecker
