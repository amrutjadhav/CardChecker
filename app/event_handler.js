const path = require('path')

class EventHandler {
  constructor(request) {
    this.action = request
  }

  eventDispatcher() {
    switch(this.action['type']) {
      case 'createCard':
        new process.env.app.handler.card(this.action)
        break
      default:
        return
    }
  }
}
