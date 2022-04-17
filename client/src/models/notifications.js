const mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
});

var Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;