const template = {
  rules: {
    card: {
      titleWordCount: 'Please describe the ticket title in more descriptive way',
      titleTitleize: 'Title of ticket is not titlezed. Titlezed naming is always helpful to understand and obviously look. Please make title titlezed',
      dueDate: 'Ticket don\'t have a due date. Take responsibility and ownership of your tasks. Please add due date to ticket.',
      labels: 'Ticket should have at least 2 labels. One for priority and other for classification. Please add the label to ticket.',
      members: 'Ticket should be assigned to someone. Please assign the ticket to someone.'
    }
  }
}

module.exports = template
