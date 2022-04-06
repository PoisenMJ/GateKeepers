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
    email: {
        type: String,
        required: true
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
    },
    country: {
        type: String,
        default: 'united-kingdom'
    },
    shippingDetails: {
        type: Object,
        default: {'united-kingdom': 0.0}
    },
    accent: {
        type: String,
        default: '#000000'
    },
    paymentLink: {
        type: String
    },
    customsOn: {
        type: Boolean,
        default: false
    }
});

const creator = mongoose.model('creator', creatorSchema);

module.exports = creator;