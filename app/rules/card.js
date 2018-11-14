const msgTemplate = require('../message_template')
const cardUtilities = require('../utilities/card')
const commonUtilities = require('../utilities/common')

module.exports = {
  titleWordCount: (card, options) => {
    let title = card.name
    let wordsCount = title.split(' ').length
    let config = commonUtilities.getScopeConfig(card.idBoard)

    if(wordsCount < config.ruleConfig.titleWordCount.min)
      return {success: false, msg: msgTemplate.rules.card.titleWordCount}
    return {success: true}
  },

  titleTitleize: (card, options) => {
    let title = card.name

    if(!title.match(/^[A-Z].*$/))
      return {success: false, msg: msgTemplate.rules.card.titleTitleize}
    return {success: true}
  },

  descriptionRequired: (card, options) => {
    if(!card.desc)
      return {success: false, msg: msgTemplate.rules.card.descriptionRequired}
    return {success: true}
  },

  dueDateRequired: (card, options) => {
    if(!card.due)
      return {success: false, msg: msgTemplate.rules.card.dueDateRequired}
    return {success: true}
  },

  dueDateComplete: (card, options) => {
    if(!card.dueComplete)
      return {success: false, msg: msgTemplate.rules.card.dueDateComplete}
    return {success: true}
  },

  labelsRequired: (card, options) => {
    let config = commonUtilities.getScopeConfig(card.idBoard)
    if(card.idLabels.length < config.ruleConfig.labelsRequired.min)
      return {success: false, msg: msgTemplate.rules.card.labelsRequired}
    return {success: true}
  },

  membersRequired: (card, options) => {
    let config = commonUtilities.getScopeConfig(card.idBoard)
    if(card.idMembers.length < config.ruleConfig.membersRequired.min)
      return {success: false, msg: msgTemplate.rules.card.membersRequired}
    return {success: true}
  },

  listOfNewCard: (card, options) => {
    let config = commonUtilities.getScopeConfig(card.idBoard)
    let listName = options.actionData.list.name.toLowerCase()
    if(listName != config.ruleConfig.listOfNewCard.listName)
      return {success: false, msg: msgTemplate.rules.card.listOfNewCard}
    return {success: true}
  },

  checkListItemStateCompletion: (card, options) => {
    let lists = card.checklists
    // if card don't have checklist items, return success.
    if(!lists.length) {
      return {success: true}
    }
    let incompleteCount = 0
    lists.forEach((list) => {
      let items = list.checkItems
      items.forEach((item) => {
        if(item['state'] != 'complete') {
          incompleteCount += 1
        }
      })
    })

    if(incompleteCount > 0) {
      return {success: false, msg: msgTemplate.rules.card.checkListItemStateCompletion(incompleteCount)}
    }
    return {success: true}
  },

  checkListItemWordCount: (card, options) => {
    let lists = card.checklists
    // if card don't have checklist items, return success.
    if(!lists.length) {
      return {success: true}
    }
    // get board configuration.
    let config = commonUtilities.getScopeConfig(card.idBoard)

    let valid = true
    lists.forEach((list) => {
      let items = list.checkItems
      items.forEach((item) => {
        let wordsCount = item.name.split(' ').length
        if(wordsCount < config.ruleConfig.checkListItemWordCount.min)
          valid = false
      })
    })
    if(!valid)
      return {success: false, msg: msgTemplate.rules.card.checkListItemWordCount}
    return {success: true}
  },

  pullRequestRequired: (card, options) => {
    let config = commonUtilities.getScopeConfig(card.idBoard)
    let labelPresent = cardUtilities.checkLabel(card, config.ruleConfig.pullRequestRequired.ignoreLabel)
    if(labelPresent) {
      return {success: true}
    }

    let isPRPresent = false
    card.attachments.forEach((attachment) => {
      let url = attachment.url
      let vcHostingDomainRegex = new RegExp(config.ruleConfig.pullRequestRequired.vcHostingDomain)

      if(url.match(vcHostingDomainRegex)) {
        isPRPresent = true
      }
    })

    if(!isPRPresent) {
      return {success: false, msg: msgTemplate.rules.card.pullRequestRequired}
    }
    return {success: true}
  }
}
