# CardChecker
Trello card checker which checks whether your employees are following the card standards or not.

###### How this works?
1. Your employee create trello card.
2. CardChecker gets the action on webhook.
3. CardChecker validates the card against the standard rules
4. If card lack to fit in rules, it send notification on slack channel. Isn't that cool?😎

###### How to setup?
1. Get the *Slack* incoming webhook for public channel and set to *SLACK_WEBOOK_URL* environment variable.
    - Incoming webhook reference = https://api.slack.com/incoming-webhooks
2. Get *Trello* token and app-key and set it to *TRELLO_TOKEN* and *TRELLO_KEY* environment variables.
    - Trello app key reference = https://trello.com/app-key
    - You can get Trello token for your personal account here = https://trello.com/app-key
3. Set the URL of app to *TRELLO_CALLBACK_URL* environment variable.
4. Set the MongoDB URL to *DB_URI* environment variable.
5. Get the id of your Trello boards using following endpoint
    - `curl 'https://api.trello.com/1/members/me/boards?key={yourKey}&token={yourToken}'`
6. Subscribe the webhook to trello board using our configuration API described below

###### Configuration API
To configure this app to your development ecosystem, it provides multiple API

1. **POST /configure/subscribe/trello/webhook**
    - To subscribe app URL as webhook for trello. Trello sends events for every operation on their platform, to this webhook.
      - Params
        - **description** - To identify the trello webhook
        - **idModel** - Id of trello board.

##### Defaults
- Currently, **CardChecker** only checks PR from *BitBucket*.

*Most of the default described above will be configurable through the confguration API.*

###### Companies using **CardChecker**
- [HivesLab](https://www.hiveslab.com/)
