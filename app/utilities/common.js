const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const defaultPipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../default_pipeline_config.yml'), 'utf8'));
const customPipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../pipeline_config.yml'), 'utf8'));
const pipelineConfig = Object.assign(defaultPipelineConfig, customPipelineConfig)

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
