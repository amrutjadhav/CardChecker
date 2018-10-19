# CardChecker
Trello card checker which checks whether your employees are following the card standards or not.

###### How this works?
1. Your employee create trello card.
2. CardChecker gets the action on webhook.
3. CardChecker validates the card against the standard rules
4. If card lack to fit in rules, it send notification on slack channel. Isn't that cool?😎

###### API
To configure this app to your development ecosystem, it provides multiple API

1. **POST /configure/subscribe/trello/webhook**
    To subscribe app URL as webhook for trello. Trello sends events for every operation on their platform, to this webhook.
    - Params
        - **description** - To identify the trello webhook
        - **idModel** - Id of trello board.


###### Companies using **CardChecker**
- [HivesLab](https://www.hiveslab.com/)
