module.exports({
  titleWordCount: (card) => {
    let title = card['name']
    let wordsCount = title.split(' ').length

    if(wordsCount < 2)
      return {success: false, msg: 'Describe the ticket title in more descriptive way'}
    return {success: true}
  }

  titleTitleize: (card) => {
    let title = card['name']

    if(!title.match(/^[A-Z].*$/))
      return {success: false, msg: 'no titlezed string'}
    return {success: true}
  }

  dueDate: (card) => {
    let title = card['name']

    if(!title['due']
      return {success: false, msg: 'no due date'}
      return {success: true}
  }
})
