const pipelineConfig = require('../../pipeline_config.json')

const commonUtilities = {
  getScopeConfig: (boardId) => {
    if(pipelineConfig.boards[boardId]) {
      return pipelineConfig.boards[boardId]
    } else {
      return pipelineConfig.company
    }
  }
}
module.exports = commonUtilities
