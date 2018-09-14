const cardRules = require('../rules/card')
const slackPublisher = require('../publishers/slack')

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
      'titleWordCount',
      'dueDate'
    ]
    this.executeRules(rules)
  }

  executeRules(rules) {
    let card = this.action['data']['card']
    let ticketValid = true
    let errorMessages = []

    rules.forEach(function(rule) {
      // @todo add method check here
      let result = cardRules[rule](card)
      if(!result['success']) {
        ticketValid = false
        errorMessages.push(result)
      }
    })
    if(!ticketValid) {
      let msg = this.buildMessage(errorMessages)
      new slackPublisher({msg: msg})
    }
  }

  buildMessage(errorMessages) {
    let msg = ":white_frowning_face: Awwww! Looks like you didn't followed the trello ticket standards \n"
    errorMessages.forEach((error) => {
      msg += "- " + error['msg'] + "\n"
    })

    msg +=  'https://trello.com/c/' + this.action['data']['card']['shortLink']
    return {
      text: msg
    }
  }
}

module.exports = Card
