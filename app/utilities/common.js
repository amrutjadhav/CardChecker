const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const deeptMerge = require('deepmerge')

const overwriteMerge = (dest, target, options) => {
  return target
}

const commonUtilities = {
  getScopeConfig: (boardId) => {
    var pipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../config/default_pipeline_config.yml'), 'utf8'));
    if(fs.existsSync(path.resolve(__dirname, '../../pipeline_config.yml'))) {
      var customPipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../config/pipeline_config.yml'), 'utf8'));
      pipelineConfig = deeptMerge(pipelineConfig, customPipelineConfig, { arrayMerge: overwriteMerge })
    }

    if(pipelineConfig.boards && pipelineConfig.boards[boardId]) {
      let boardConfig = pipelineConfig.boards[boardId]
      // Merge company level default config with board pipelineConfig.
      return deeptMerge(pipelineConfig.company, boardConfig, { arrayMerge: overwriteMerge })
    } else {
      return pipelineConfig.company
    }
  },

  getConfig: () => {
    var pipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../config/default_pipeline_config.yml'), 'utf8'));
    if(fs.existsSync(path.resolve(__dirname, '../../pipeline_config.yml'))) {
      var customPipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../config/pipeline_config.yml'), 'utf8'));
      pipelineConfig = deeptMerge(pipelineConfig, customPipelineConfig, { arrayMerge: overwriteMerge })
    }
    return pipelineConfig
  }
}
module.exports = commonUtilities
