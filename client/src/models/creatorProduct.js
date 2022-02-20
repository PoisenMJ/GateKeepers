const mongoose = require('mongoose');

const creatorProductSchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'creator',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price : {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    imageOrder: {
        type: [Number],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    uri: {
        type: String,
        required: true
    },
    sizes: {
        type: [String],
        default: []
    },
    customSize: {
        type: Boolean,
        default: false
    },
    color: {
        type: String
    },
    dateToPost: {
        type: String,
        required: true
    }
});

const creatorProduct = mongoose.model('creatorProduct', creatorProductSchema);

module.exports = creatorProduct;