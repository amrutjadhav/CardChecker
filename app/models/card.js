const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  ticket_id: {type: String, index: true}
  is_valid: {type: Boolean, default: false}
})

module.exports = mongoose.model('Card', cardSchema)
