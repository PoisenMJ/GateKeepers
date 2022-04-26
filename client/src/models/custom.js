const mongoose = require('mongoose');
const CustomsMessage = require('./customsMessage');

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
    },
    messages: [{
        ref: 'customsMessage',
        type: mongoose.Schema.Types.ObjectId
    }]
});

customSchema.methods.saveMessage = function({ from, to, message, type }){
    console.log('saveing mseg');
    console.log(message);
    try {
        var msg = new CustomsMessage({from, to, message, type});
        msg.save();
        this.messages.push(msg._id);
        this.save();
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}

customSchema.methods.getLatestMessageFromUser = function(_user){
    if(this.messages){
        var _message_from_user = [];
        for(var i = 0; i < this.messages.length; i++){
            if(this.messages[i].from === _user) _message_from_user.push(this.messages[i]);
        }
        return _message_from_user[_message_from_user.length-1].date;
    } else return false;
}

var Custom = mongoose.model('custom', customSchema);

module.exports = Custom;