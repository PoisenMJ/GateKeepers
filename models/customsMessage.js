const mongoose = require('mongoose');

const customsMessageSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: 'message',
  },
});

const CustomsMessage = mongoose.model('customsMessage', customsMessageSchema);

module.exports = CustomsMessage;
