const slackPublisher = require('../publishers/slack')
const logger = require('../../config/logger')
const cardModel = require('../models/card')
const cardUtilities = require('../utilities/card')

class Card {
  constructor(action) {
    this.action = action
    this.handlerDispatcher()
  }

  handlerDispatcher() {
    let cardId = this.action.data.card.id
    cardUtilities.fetchCard(cardId, {attachments: true, checklists: 'all'}).then((card) => {
      let cardCategory = cardUtilities.getCardCategory(card)
      switch(this.action.type) {
      case 'createCard':
        this.handlerCreateCard(card, {cardCategory: cardCategory})
        break
      case 'updateCard':
        this.handleUpdateCard(card, {cardCategory: cardCategory})
        break
      case 'deleteCard':
        this.handleArchivedCardAction(card)
        break
      }
    }).catch((error) => {
      logger.error(error)
    })
    return
  }

  handlerCreateCard(card, options) {
    let rules = [
      'titleWordCount',
      'titleTitleize',
      'descriptionAvailabilty',
      'labels',
      'listOfNewCard'
    ]
    this.executeRules(card, rules, 'createCard')
  }

  handleUpdateCard(card, options) {
    let rules = []
    switch(this.action.display.translationKey) {
    case 'action_move_card_from_list_to_list':
      rules = this.getListRules(card, options)
      break
    case 'action_archived_card':
      this.handleArchivedCardAction(card)
      break
    }

    // If rules are empty, return.
    if(!rules)
      return
    this.executeRules(card, rules, 'updateCard')
  }

  handleArchivedCardAction(card) {
    cardUtilities.deleteCardDoc(card.id)
  }

  getListRules(card, options) {
    let rules = []
    let cardList = card.list.name.toLowerCase();
    if(cardList == 'in progress') {
      rules.push('inProgressListMembersRequired', 'dueDate')
    }
    if(cardList == 'in review' && card.checklists.length > 0) {
      rules.push('checkListItemStateCompletion')
    }
    // PR only exists for dev cards, not for marketing or SEO tasks. So check here, if card category is development or not?
    if(cardList == 'in review' && options.cardCategory == 'development') {
      rules.push('pullRequestAttachment')
    }
    // rule to check if due date is marked as complete or not.
    if(cardList == 'merged' || cardList == 'done') {
      rules.push('dueDateComplete')
    }
    return rules
  }

  executeRules(card, rules, eventType) {
    let options = {actionData: this.action.data}

    let result = cardUtilities.executeRules(card, rules, options)

    if(result.ticketValid) {
      // if ticket is valid, delete the entry from DB.
      cardUtilities.deleteCardDoc(card.id)
    } else {
      this.handleInvalidCard(card, result.errorMessages, eventType)
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
      cardModel.findOne({card_id: card.id}, (error, doc) => {
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
        } else {
          this.notifyErrors(card, errorMessages)
        }
      })
    }
  }

  notifyErrors(card, errorMessages) {
    // notify on slack
    let titleMsg = '@' + this.action.memberCreator.username + '\n :white_frowning_face: Awwww! Looks like you didn\'t followed the trello ticket standards \n'
    let msg = cardUtilities.buildMessage(card, titleMsg, errorMessages)
    new slackPublisher({msg: msg})
  }
}

module.exports = Card
