const cardHandler = require('../handlers/card')

class EventController {
  trelloEvents(action) {
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

module.exports = EventController
