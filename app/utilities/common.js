const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
var pipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../default_pipeline_config.yml'), 'utf8'));
if(fs.existsSync('../../pipeline_config.yml')) {
  var customPipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../pipeline_config.yml'), 'utf8'));
  pipelineConfig = Object.assign(pipelineConfig, customPipelineConfig)
}

const commonUtilities = {
  getScopeConfig: (boardId) => {
    if(pipelineConfig.boards && pipelineConfig.boards[boardId]) {
      let boardConfig = pipelineConfig.boards[boardId]
      // Merge company level default config with board pipelineConfig.
      return Object.assign(pipelineConfig.company, boardConfig)
    } else {
      return pipelineConfig.company
    }
  }
}
module.exports = commonUtilities
