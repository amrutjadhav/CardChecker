const cardRules = require('../rules/card')
const slackPublisher = require('../publishers/slack')
const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)
const logger = require('../../config/logger')
const cardModel = require('../models/card')
const cardUtilities = require('../utilities/card')

class Card {
  constructor(action) {
    this.action = action
    this.handlerDispatcher()
  }

  handlerDispatcher() {
    switch(this.action['type']) {
    case 'createCard':
      this.handlerCreateCard()
      break
    case 'updateCard':
      this.handleUpdateCard()
      break
    case 'deleteCard':
      this.handleArchivedCardAction()
      break
    }
    return
  }

  handlerCreateCard() {
    let rules = [
      'titleWordCount',
      'titleTitleize',
      'descriptionAvailabilty',
      'labels',
      'listOfNewCard'
    ]
    let cardId = this.action['data']['card']['id']
    cardUtilities.fetchCard(cardId).then((response) => {
      this.executeRules(response, rules, 'createCard')
    }).catch((error) => {
      logger.error(error)
    })
  }

  handleUpdateCard() {
    let rules = []
    switch(this.action['display']['translationKey']) {
      case 'action_move_card_from_list_to_list':
        rules = this.getListToListCardMoveRules()
        break
      case 'action_archived_card':
        this.handleArchivedCardAction()
        break
    }

    // If rules are empty, return.
    if(!rules)
      return

    let cardId = this.action['data']['card']['id']
    cardUtilities.fetchCard(cardId).then((response) => {
      this.executeRules(response, rules, 'updateCard')
    }).catch((error) => {
      logger.error(error)
    })
  }

  handleArchivedCardAction() {
    let cardId = this.action['data']['card']['id']
    cardUtilities.fetchCard(cardId).then((card) => {
      cardUtilities.deleteCardDoc(card['id'])
    }).catch((error) => {
      logger.error(error)
    })
  }

  getListToListCardMoveRules() {
    let data = this.action['data']
    // let listBefore = data['listBefore']['name'].toLowerCase()
    let listAfter = data['listAfter']['name'].toLowerCase()

    if(listAfter == 'in progress') {
      return ['inProgressListMembersRequired', 'dueDate']
    }
    return []
  }

  executeRules(card, rules, eventType) {
    let options = {actionData: this.action['data']}

    let result = cardUtilities.executeRules(card, rules, options)

    if(result['ticketValid']) {
      // if ticket is valid, delete the entry from DB.
      cardUtilities.deleteCardDoc(card['id'])
    } else {
      this.handleInvalidCard(card, result['errorMessages'], eventType)
    }
  }

  handleInvalidCard(card, errorMessages, eventType) {
    if(eventType == 'createCard') {
      // for new card, save card. no need to check
      cardUtilities.createCardDoc(card).then(() => {
        this.notifyErrors(card, errorMessages)
      }, (error) => {
        logger.error(error)
      }).catch((error) => {
        logger.error(error)
      })
    } else if(eventType == 'updateCard') {
      cardModel.findOne({card_id: card['id']}, (error, doc) => {
        if(error){
          logger.error(error)
        } else if(!doc) {
          cardUtilities.createCardDoc(card).then(() => {
            this.notifyErrors(card, errorMessages)
          }, (error) => {
            logger.error(error)
            new slackPublisher({msg: 'Your db is having problem'})
          }).catch((error) => {
            logger.error(error)
          })
        }
      })
    }
  }

  notifyErrors(card, errorMessages) {
    // notify on slack
    let titleMsg = '@' + this.action['memberCreator']['username'] + '\n :white_frowning_face: Awwww! Looks like you didn\'t followed the trello ticket standards \n'
    let msg = cardUtilities.buildMessage(card, titleMsg, errorMessages)
    new slackPublisher({msg: msg})
  }
}

module.exports = Card
