const mongoose = require('mongoose');
const CustomsMessage = require('./customsMessage');

const customSchema = mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  initialDescription: {
    type: String,
    required: true,
  },
  initialPrice: {
    type: Number,
    required: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: String,
    required: true,
  },
  messages: [{
    ref: 'customsMessage',
    type: mongoose.Schema.Types.ObjectId,
  }],
});

customSchema.methods.saveMessage = function ({
  from, to, message, type,
}) {
  console.log('saveing mseg');
  console.log(message);
  try {
    const msg = new CustomsMessage({
      from, to, message, type,
    });
    msg.save();
    // eslint-disable-next-line no-underscore-dangle
    this.messages.push(msg._id);
    this.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

customSchema.methods.getLatestMessageFromUser = function (_user) {
  if (this.messages) {
    const messageFromUser = [];
    for (let i = 0; i < this.messages.length; i += 1) {
      if (this.messages[i].from === _user) messageFromUser.push(this.messages[i]);
    }
    return messageFromUser[messageFromUser.length - 1].date;
  } return false;
};

const Custom = mongoose.model('custom', customSchema);

module.exports = Custom;
