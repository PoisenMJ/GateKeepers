const mongoose = require('mongoose');

const creatorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    tag: {
        type: String,
        required: true,
        unique: true
    },
    links: {
        type: {},
        default: [
            {"instagram": ""},
            {"tiktok": ""},
            {"twitter": ""},
            {"twitch": ""}
        ]
    },
    image: {
        type: String,
        required: true
    }
});

const creator = mongoose.model('creator', creatorSchema);

module.exports = creator;