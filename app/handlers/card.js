const cardRules = require('../rules/card')
const slackPublisher = require('../publishers/slack')
const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)
const logger = require('../../config/logger')

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
    this.fetchCard().then((response) => {
      this.executeRules(response, rules)
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
    }

    // If rules are empty, return.
    if(!rules)
      return

    this.fetchCard().then((response) => {
      this.executeRules(response, rules)
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

  executeRules(card, rules) {
    let ticketValid = true
    let errorMessages = []
    let actionData = this.action['data']

    rules.forEach(function(rule) {
      // @todo add method check here
      let result = cardRules[rule](card, {actionData: actionData})
      if(!result['success']) {
        ticketValid = false
        errorMessages.push(result['msg'])
      }
    })
    if(!ticketValid) {
      let msg = this.buildMessage(card, errorMessages)
      new slackPublisher({msg: msg})
    }
  }

  fetchCard() {
    let cardId = this.action['data']['card']['id']
    return trello.makeRequest('get', '/1/cards/' + cardId, {webhooks: true})
  }

  buildMessage(card, errorMessages) {
    let msg = '@' + this.action['memberCreator']['username'] + '\n :white_frowning_face: Awwww! Looks like you didn\'t followed the trello ticket standards \n'
    errorMessages.forEach((error) => {
      msg += '- ' + error + '\n'
    })
    msg +=  card['shortUrl']
    return {
      text: msg
    }
  }
}

module.exports = Card
