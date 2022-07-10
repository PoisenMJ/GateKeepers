const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unqiue: true,
  },
  image: String,
  accountType: {
    type: String,
    enum: ['user', 'creator'],
    default: 'user',
  },
  customerID: {
    type: String,
    default: '',
  },
  activationCode: {
    type: String,
  },
  accountActivated: {
    type: Boolean,
    default: false,
  },
  updateCode: {
    type: String,
    default: '',
  },
  instaLogin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.encryptPassword = function (password) {
  return crypto.createHash('md5').update(password).digest('hex');
};

userSchema.methods.checkPassword = function (password) {
  // console.log(`User pw: ${this.password}`)
  // console.log(`Input pw: ${this.encryptPassword(password)}`)
  return this.encryptPassword(password) === this.password;
};

userSchema.statics.encryptPassword = function (password) {
  return crypto.createHash('md5').update(password).digest('hex');
};

userSchema.pre('save', function (next) {
  const user = this;
  const hashedPassword = crypto.createHash('md5').update(user.password).digest('hex');
  user.password = hashedPassword;
  return next();
});

const user = mongoose.model('user', userSchema);

module.exports = user;
