const mongoose = require('mongoose');

const creatorPostSchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'creator',
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const creatorPost = mongoose.model('creatorPost', creatorPostSchema);

module.exports = creatorPost;