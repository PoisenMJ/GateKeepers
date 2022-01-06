const mongoose = require('mongoose');
const crypto = require('crypto');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unqiue: true
    },
    image: String
});

userSchema.methods.encryptPassword = function(password){
    return crypto.createHash('md5').update(password).digest('hex');
}

userSchema.methods.checkPassword = function(password){
    return this.encryptPassword(password) == this.password;
}

userSchema.statics.encryptPassword = function(password){
    return crypto.createHash('md5').update(password).digest('hex');
}

userSchema.pre('save', function (next) {
    var user = this;
    var hashedPassword = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = hashedPassword;
    return next();
});

var user = mongoose.model('user', userSchema);

module.exports = user;