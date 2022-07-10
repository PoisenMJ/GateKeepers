const mongoose = require('mongoose');

const keySchema = mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  key: {
    type: String,
    required: true,
  },
});

const key = mongoose.model('key', keySchema);

module.exports = key;
