const template = {
  rules: {
    card: {
      titleWordCount: 'Please describe the ticket title in more descriptive way',
      titleTitleize: 'Title of ticket is not titliezed. Please make title titliezed',
      descriptionAvailabilty: 'Ticket don\'t have description. Add some.'
      dueDate: 'Ticket don\'t have a due date. Take responsibility and ownership of your tasks.',
      labels: 'Ticket should have at least 2 labels. One for priority and other for classification.',
      members: 'Please assign the ticket to someone.'
    }
  }
}

module.exports = template
