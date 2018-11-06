const template = {
  rules: {
    card: {
      titleWordCount: 'Please describe the ticket title in more descriptive way',
      titleTitleize: 'Title of ticket is not titliezed. Please make title titliezed',
      descriptionRequired: 'Ticket don\'t have description. Add some.',
      dueDateRequired: 'Ticket don\'t have a due date. Take responsibility and ownership of your tasks.',
      dueDateComplete: 'When card moves to *Merged*/*Done* list, due date should be mark as complete.',
      labelsRequired: 'Ticket should have at least 2 labels. One for priority and other for classification.',
      membersRequired: 'Card should be assigned to someone if it is pushed to *In Progress*',
      listOfNewCard: 'Card should be created only in \'Task\' list.',
      checkListItemStateCompletion: (incompleteCount) => {
        return 'When the card is moved to *In Review* list, all the checklist items in card should be get completed. There are ' + incompleteCount + ' items, which are not completed yet.'
      },
      pullRequestRequired: 'When card moves to *In Review* list, it should have pull request attached to it.'
    }
  },
  controllers: {
    configuration: {
      validation: {
        subscribeTrelloWebhook: {
          descriptionRequired: 'Webhook description is required.',
          idModelRequired: 'Trello model id is required.'
        }
      }
    }
  }
}

module.exports = template
