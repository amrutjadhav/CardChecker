const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const pipelineConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../default_pipeline_config.yml'), 'utf8'));

const commonUtilities = {
  getScopeConfig: (boardId) => {
    // Avoid manipulation of const.
    let config = pipelineConfig
    // check if user defined a custom pipeline config file. If yes, merge with default pipeline config file.
    if(fs.existsSync('../../pipeline_config.json')) {
      let userConfig = require('../../pipeline_config.json')
      config = Object.assign(config, userConfig)
    }

    if(config.boards && config.boards[boardId]) {
      let boardConfig = config.boards[boardId]
      // Merge company level default config with board config.
      return Object.assign(config.company, boardConfig)
    } else {
      return config.company
    }
  }
}
module.exports = commonUtilities
