const mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    orderID: {
        type: String,
        required: true
    },
    items: {
        //[item_id]
        type: [String],
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
    customerID: {
        type: String,
        required: true
    },
    user: {
        type: String,
        default: ''
    }
})

const order = mongoose.model('order', orderSchema);
module.exports = order;