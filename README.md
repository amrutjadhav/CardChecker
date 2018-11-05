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
  * **Note:**
    *  If you have organization and wants to monitor all boards, whose you are not member of, then it is recommended that, you create a separate user for app on Trello and add that user to all of your company's board as app only support single user token for Trello. Then get the app token and key for that user from Trello and use it for API calls.
3. Set the URL of app to *TRELLO_CALLBACK_URL* environment variable.
4. Set the MongoDB URL to *DB_URI* environment variable.
5. Get the id of your Trello boards using following endpoint
    - `curl 'https://api.trello.com/1/members/me/boards?key={yourKey}&token={yourToken}'`
6. Subscribe the webhook to trello board using our configuration API described below

##### Configuration
Every one has their own unique development flow. Keeping this mind, **CardChecker** provides multiple ways to customize thier development pipeline and adjust filters.

1. **Pipeline Config file**
  This config file allows user to configure the pipeline and filters. App already have `default_pipeline_config.json` which describe default behaviour of app. You can override this file by creating new file `pipeline_config.json` at root. **CardChecker** will append specfied configurations on defaults so you don't have to specify all in your file. To know more about the format of config file, please refer, `default_pipeline_config.json`.

2. **CardChecker** uses *Trello* API to fetch card and validate it. To set your app as webhook for *Trello*, **CardChecker** provide useful API.
  -   **POST /configure/subscribe/trello/webhook**
    - To subscribe app URL as webhook for trello. Trello sends events for every operation on their platform, to this webhook.
      - Params
        1. **description** - To identify the trello webhook
        2. **idModel** - Id of trello board.


###### Companies using **CardChecker**
- [HivesLab](https://www.hiveslab.com/)
