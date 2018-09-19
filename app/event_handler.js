const cardHandler = require('./handlers/card')

class EventHandler {
  constructor(action) {
    this.eventDispatcher(action)
  }

  eventDispatcher(action) {
    switch(action['type']) {
    case 'createCard':
    case 'updateCard':
      new cardHandler(action)
      break
    default:
      return
    }
    return
  }
}

module.exports = EventHandler
