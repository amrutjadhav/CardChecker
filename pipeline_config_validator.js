const logger = require('./config/logger')
const fs = require('fs')
const Ajv = require('Ajv')
const ajv = Ajv({allErrors: true});
const cardRules = require('./app/rules/card')

class PipelineConfigValidator {

  constructor() {
    this.defaultRules = Object.keys(cardRules)
  }

  validate() {
    const commonUtilities = require('./app/utilities/common')
    // get all the configuration irrespective of scope
    let pipelineConfig = commonUtilities.getConfig()
    // validate scope level schema
    this.validateScopeLevelSchema(pipelineConfig)
    // validate company configuration
    let companyConfig = pipelineConfig.company
    this.validateCommonSchema(companyConfig)
    this.validateRules(companyConfig)
    // validate board configuration
    let boardsConfig = pipelineConfig.boards
    if(boardsConfig) {
      Object.keys(boardsConfig).map((boardId, index) => {
        let boardConfig = commonUtilities.getScopeConfig(boardId)
        this.validateCommonSchema(boardConfig)
        this.validateRules(boardConfig)
      });
    }
    process.exit(0)
  }

  validateRules(scopeConfiguration) {
    this.validateRulesName(scopeConfiguration.cardRules)

    Object.keys(scopeConfiguration.listRules).map((listName, index) => {
      let rules = scopeConfiguration.listRules[listName]
      if(!Array.isArray(rules)) {
        this.showError('Every list name should have array of rules')
      }
      this.validateRulesName(rules)
    })
  }

  validateRulesName(specifiedRules) {
    let invalidRules = []
    specifiedRules.forEach((rule) => {
      if(!this.defaultRules.includes(rule)) {
        invalidRules.push(rule)
      }
    })
    if(invalidRules.length > 0)
      this.showError('Invalid Rules', invalidRules)
  }

  validateScopeLevelSchema(pipelineConfig) {
    let schema = {
      'type': 'object',
      'properties': {
        'company': {
          'description': 'company level configuration',
          'type': 'object'
        },
        'boards': {
          'description': 'board level configuration',
          'type': ['object', 'null']
        }
      },
      'required': [
        'company',
        'boards'
      ]
    }
    let valid = ajv.validate(schema, pipelineConfig)
    if(!valid)
      this.showError(ajv.errors)
  }

  validateCommonSchema(scopeConfiguration) {
    // rule check
    let schema = {
      'type': 'object',
      'properties': {
        'defaults': {
          'description': 'default values',
          'properties': {
            'officeStartHour': {'type': 'string'},
            'officeEndHour': {'type': 'string'},
            'weekendDays': {
              'type': 'array',
              'maxItems': 6,
              'minItems': 0
            },
            'checkerJobDelay': {
              'type': 'number',
              'maximum': 59
            }
          },
          'required': [
            'officeStartHour',
            'officeEndHour',
            'weekendDays',
            'checkerJobDelay'
          ]
        },
        'ruleConfig': {
          'description': 'Rules configuration',
          'properties': {
            'titleWordCount': {
              'description': 'titleWordCount rule configuration',
              'properties': {
                'min': {'type': 'number'}
              },
              'required': [
                'min'
              ]
            },
            'labelsRequired': {
              'description': 'labelsRequired rule configuration',
              'properties': {
                'min': {'type': 'number'}
              },
              'required': [
                'min'
              ]
            },
            'membersRequired': {
              'description': 'membersRequired rule configuration',
              'properties': {
                'min': {'type': 'number'}
              },
              'required': [
                'min'
              ]
            },
            'listOfNewCard': {
              'description': 'listOfNewCard rule configuration',
              'properties': {
                'listName': {'type': 'string'}
              },
              'required': [
                'listName'
              ]
            },
            'pullRequestRequired': {
              'description': 'pullRequestRequired rule configuration',
              'properties': {
                'vcHostingDomain': {
                  'type': 'string',
                  'format': 'url'
                },
                'ignoreLabel': {'type': 'string'}
              },
              'required': [
                'vcHostingDomain',
                'ignoreLabel'
              ]
            }
          },
          'required': [
            'titleWordCount',
            'labelsRequired',
            'membersRequired',
            'listOfNewCard',
            'pullRequestRequired'
          ]
        },
        'cardRules': {
          'description': 'default rules for a card',
          'type': 'array'
        },
        'listRules': {
          'description': 'rules based on list name',
          'type': 'object'
        }
      },
      'required': [
        'defaults',
        'ruleConfig',
        'cardRules',
        'listRules'
      ]
    }
    let valid = ajv.validate(schema, scopeConfiguration)
    if(!valid)
      this.showError(ajv.errors)
  }

  showError(msg, options) {
    logger.error(msg, options)
    process.exit(1)
  }
}

let validator = new PipelineConfigValidator()
validator.validate()
