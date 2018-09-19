const msgTemplate = require('../message_template')

module.exports = {
  titleWordCount: (card, options) => {
    let title = card['name']
    let wordsCount = title.split(' ').length

    if(wordsCount < 2)
      return {success: false, msg: msgTemplate['rules']['card']['titleWordCount']}
    return {success: true}
  },

  titleTitleize: (card, options) => {
    let title = card['name']

    if(!title.match(/^[A-Z].*$/))
      return {success: false, msg: msgTemplate['rules']['card']['titleTitleize']}
    return {success: true}
  },

  descriptionAvailabilty: (card, options) => {
    if(!card['desc'])
      return {success: false, msg: msgTemplate['rules']['card']['descriptionAvailabilty']}
    return {success: true}
  },

  dueDate: (card, options) => {
    if(!card['due'])
      return {success: false, msg: msgTemplate['rules']['card']['dueDate']}
    return {success: true}
  },

  labels: (card, options) => {
    if(card['idLabels'].length < 2)
      return {success: false, msg: msgTemplate['rules']['card']['labels']}
    return {success: true}
  },

  members: (card, options) => {
    if(card['idMembers'].length < 1)
      return {success: false, msg: msgTemplate['rules']['card']['members']}
    return {success: true}
  },

  listOfNewCard: (card, options) => {
    let listName = options['actionData']['list']['name'].toLowerCase()
    if(listName != 'tasks')
      return {success: false, msg: msgTemplate['rules']['card']['listOfNewCard']}
    return {success: true}
  },

  inProgressListMembersRequired: (card, options) => {
    if(card['idMembers'].length < 1)
      return {success: false, msg: msgTemplate['rules']['card']['inProgressListMembersRequired']}
    return {success: true}
  }
}
