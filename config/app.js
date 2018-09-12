const path = require('path')

module.exports = {
  eventHandler: require('../app/event_handler.js'),
  handler: {
    card: require('../app/handlers/card')
  }
}
