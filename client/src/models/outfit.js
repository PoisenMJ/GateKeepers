const mongoose = require('mongoose');
const crypto = require('crypto');

var outfitSchema = mongoose.Schema({
    user: {
        type: String
    },
    name: {
        type: String
    },
    image: {
        type: String
    },
    items: {
        type: Object,
        default: {}
    }
});

outfitSchema.methods.addItem = function(type, value){
    this.items[type] = value;
    console.log(this);
    this.save();
}

const outfit = mongoose.model('outfit', outfitSchema);

module.exports = outfit;