const logger = require('log4js').getLogger();
logger.level = 'debug'

module.exports.getLogger = (name = '') => {
  return logger
}
