const fs = require('fs')
const pipelineConfig = require('../../default_pipeline_config.json')

const commonUtilities = {
  getScopeConfig: (boardId) => {
    // check if user defined a custom pipeline config file. If yes, merge with default pipeline config file.
    if(fs.existsSync('../../pipeline_config.json')) {
      let userDefinedConfig = require('../../pipeline_config.json')
      pipelineConfig = Object.assign(pipelineConfig, userDefinedConfig)
    }

    if(pipelineConfig.boards[boardId]) {
      return pipelineConfig.boards[boardId]
    } else {
      return pipelineConfig.company
    }
  }
}
module.exports = commonUtilities
