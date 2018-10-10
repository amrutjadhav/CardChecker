const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  card_id: {type: String, index: true, unique: true},
  is_valid: {type: Boolean, default: false}
})

module.exports = mongoose.model('Card', cardSchema)
