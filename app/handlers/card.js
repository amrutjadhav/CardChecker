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
    let card = this.action['card']
    rules.forEach(function(rule) {
      // @todo add method check here
      let result = cardRules[rule](card)
      if(!result['success']) {
        new slackPublisher(result['msg'])
      }
    })
  }
}

module.exports = Card
