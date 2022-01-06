const mongoose = require('mongoose');

var keySchema = mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    key: {
        type: String,
        required: true
    }
});

var key = mongoose.model('key', keySchema);

module.exports = key;