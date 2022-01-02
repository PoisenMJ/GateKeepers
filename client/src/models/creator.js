const mongoose = require('mongoose');

const creatorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true,
        unique: true
    },
    links: {
        type: {}
    },
    image: {
        type: String,
        required: true
    }
});

const creator = mongoose.model('creator', creatorSchema);

module.exports = creator;