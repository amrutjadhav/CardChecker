const express = require('express')
const app = express()
const path = require('path')

process.env.app = require(path.join(__dirname, 'config', 'app'))

app.get('/', (req, res) => res.send('Hello World!'))

// post trello webhook
app.post('/', (req, res) => {
    process.env.app.eventHandler(req)
})

app.listen(8080, () => {
    console.log('Listening on 3000')
})
