const template = {
  rules: {
    card: {
      titleWordCount: 'Please describe the ticket title in more descriptive way',
      titleTitleize: 'Title of ticket is not titliezed. Please make title titliezed',
      descriptionAvailabilty: 'Ticket don\'t have description. Add some.',
      dueDate: 'Ticket don\'t have a due date. Take responsibility and ownership of your tasks.',
      labels: 'Ticket should have at least 2 labels. One for priority and other for classification.',
      members: 'Please assign the ticket to someone.',
      inProgressListMembersRequired: 'Card should be assigned to someone if it card is pushed to \'In Progress\'',
      listOfNewCard: "Card should be created only in 'Task' list.",
      checkListItemStateCompletion: (incompleteCount) => {
        "When the card is moved to 'In Review' list, all the checklist items in card should be get completed. There are " + incompleteCount + "items, which are not completed yet."
      }
    }
  }
}

module.exports = template
