const fs = require('fs')
const pipelineConfig = require('../../default_pipeline_config.json')

const commonUtilities = {
  getScopeConfig: (boardId) => {
    // Avoid manipulation of const.
    let config = pipelineConfig
    // check if user defined a custom pipeline config file. If yes, merge with default pipeline config file.
    if(fs.existsSync('../../pipeline_config.json')) {
      let userConfig = require('../../pipeline_config.json')
      config = Object.assign(config, userConfig)
    }

    if(config.boards[boardId]) {
      return config.boards[boardId]
    } else {
      return config.company
    }
  }
}
module.exports = commonUtilities
