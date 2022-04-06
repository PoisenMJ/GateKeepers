const mongoose = require('mongoose');

var customSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    initialDescription: {
        type: String,
        required: true
    },
    initialPrice: {
        type: Number,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: String,
        required: true
    }
})

var Custom = mongoose.model('custom', customSchema);

module.exports = Custom;