const mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    orderID: {
        type: String,
        required: true
    },
    items: {
        //[item_id]
        type: [{}],
        required: true
    },
    date: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    customerID: {
        type: String,
        required: true
    },
    user: {
        type: String,
        default: ''
    },
    address: {
        type: {},
        required: true
    },
    creators: {
        type: [String],
        required: true
    },
    sent: {
        type: Boolean,
        default: false
    }
})

const order = mongoose.model('order', orderSchema);
module.exports = order;