module.exports({
  checkTitleWordCount: (card) => {
    let title = card['name']
    let wordsCount = title.split(' ').length

    if(wordsCount < 2)
      return {success: false, msg: 'Describe the ticket title in more descriptive way'}
  }
})
