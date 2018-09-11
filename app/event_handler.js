const path = require('path')
const cardRules = path.join('__dirname', 'lib', 'rules', 'card')

class EventHandler {
  constructor(request) {
    this.action = request
  }

  eventDispatcher() {
    switch(this.action['type']) {
      case 'createCard':
        handlerCreateCard()
        break
      default:
        return
    }
  }

  handlerCreateCard() {

  }
}
