const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;
