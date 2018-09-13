const cardRules = require('../rules/card')
const slackPublisher = require('../publishers/slack')

class Card {
  constructor(action) {
    this.action = action
    handlerDispatcher()
  }

  handlerDispatcher() {
    switch(this.action['type']) {
      case 'createCard':
        handlerCreateCard()
        break;
    }
  }

  handlerCreateCard() {
    let rules = [
      'titleWordCount',
      'titleWordCount',
      'dueDate'
    ];
    executeRules(rules)
  }

  executeRules(card, rules) {
    let card = this.action['card']
    rules.forEach(function(rule) {
      // @todo add method check here
      result = cardRules[rule]()
      if(!result['success']) {
        new slackPublisher(result['msg'])
      }
    })
  }
}

module.exports = Card
