const cardRules = require('../rules/card')
const slackPublisher = require('../publishers/slack')
const Trello = require("trello");
const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);
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
    }
    return
  }

  handlerCreateCard() {
    let rules = [
      'titleWordCount',
      'titleTitleize',
      'dueDate',
      'labels',
      'members'
    ]
    this.fetchCard().then((response) => {
      this.executeRules(response, rules)
    }).catch((error) => {
      logger.error(error)
    })
  }

  executeRules(card, rules) {
    let ticketValid = true
    let errorMessages = []

    rules.forEach(function(rule) {
      // @todo add method check here
      let result = cardRules[rule](card)
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
    let msg = ':white_frowning_face: Awwww! Looks like you didn\'t followed the trello ticket standards \n'
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
