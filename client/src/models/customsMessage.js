const mongoose = require('mongoose');

var customsMessageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
})

var CustomsMessage = mongoose.model('customsMessage', customsMessageSchema);

module.exports = CustomsMessage;