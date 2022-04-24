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

var Custom = mongoose.model('custom', customSchema);

module.exports = Custom;