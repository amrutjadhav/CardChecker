# CardChecker
Trello card checker which checks whether your employees are following the card standards or not.

#### How this works?
1. Your employee creates Trello card.
2. CardChecker gets the action on webhook.
3. CardChecker validates the card against the standard rules
4. If card lack to fit in rules, it sends notification on the slack channel. Isn't that cool?😎

#### How to setup?
1. Get the *Slack* incoming webhook for public channel and set to *SLACK_WEBOOK_URL* environment variable.
    - Incoming webhook reference = https://api.slack.com/incoming-webhooks
2. Get *Trello* token and app-key and set it to *TRELLO_TOKEN* and *TRELLO_KEY* environment variables.
  - Trello app key reference = https://trello.com/app-key
  - You can get Trello token for your personal account here = https://trello.com/app-key
  * **Note:**
    *  If you have organization and wants to monitor all boards, whose you are not a member of, then it is recommended that you create a separate user for the app on Trello and add that user to all of your company's board as the app only support single user token for Trello. Then get the app token and key for that user from Trello and use it for API calls.
3. Set the URL of the app to *TRELLO_CALLBACK_URL* environment variable.
4. Set the MongoDB URL to *DB_URI* environment variable.
5. Get the id of your Trello boards using the following endpoint
    - `curl 'https://api.trello.com/1/members/me/boards?key={yourKey}&token={yourToken}'`
6. Subscribe the webhook to Trello board using our configuration API described below

#### Configuration
Everyone has their own unique development flow. Keeping this mind, **CardChecker** provides multiple ways to customize their development pipeline and adjust filters.

1. **Pipeline Config file**
  This config file allows a user to configure the pipeline and filters. App already has `default_pipeline_config.json` which describe default behavior of the app. You can override this file by creating a new file `pipeline_config.json` at the root. **CardChecker** will append specified configurations on defaults so you don't have to specify all in your file. To know more about the format of the config file, please refer, `default_pipeline_config.json`.

2. **CardChecker** uses *Trello* API to fetch card and validate it. To set your app as webhook for *Trello*, **CardChecker** provide useful API.
    -   **POST /configure/subscribe/trello/webhook**
        - To subscribe app URL as webhook for Trello. Trello sends events for every operation on their platform, to this webhook.
        - Params
            1. **description** - To identify the trello webhook
            2. **idModel** - Id of trello board.

#### Rules
**CardChecker** comes with predefined rules to validate your cards. Most of these rules are configurable through `pipeline_config.yml` file. Below is the list of currently available rules. It also specifies keys which you can specify in `pipeline_config.yml` file to alter the behavior of rule.
1. ###### titleWordCount
    Check word count in the title of a card.
    - *min* - Configure the minimum number of words required in a title.
2. ###### titleTitleize
    Check whether the title of a card is titleized or not.
3. ###### descriptionRequired
    Check whether description is provided or not in card.
4. ###### dueDateRequired
    Checks whether due date is set to a card or not.
5. ###### dueDateComplete
    Check whether due date is marked as complete or not.
6. ###### labelsRequired
    Check whether a card has the minimum number of labels attached to it or not.
    - *min* - Minimum number of words required in a title.
7. ###### membersRequired
    Check whether a card has been assigned to the specified number of employees or not.
    - *min* - Minimum number of members to which card should be assigned.
8. ###### listOfNewCard
    Checklist of the newly created card. A card should always be created in the first list of a pipeline.
    - *listName* - Trello board list name which acts as an entry point of a pipeline.
9. ###### checkListItemStateCompletion
    Check whether all the checklist items are marked as complete or not.
10. ###### pullRequestRequired
    Check whether pull request is attached to card as attachement or not.
    - *vcHostingDomain* - Version control hosting service domain name.
##### Companies using **CardChecker**
- [HivesLab](https://www.hiveslab.com/)
