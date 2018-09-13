const cardHandler = require('./handlers/card')

class EventHandler {
  constructor(request) {
    this.action = request
  }

  eventDispatcher() {
    switch(this.action['type']) {
    case 'createCard':
      new cardHandler(this.action)
      break
    default:
      return
    }
  }
}

module.exports = EventHandler
