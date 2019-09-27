const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  },
  avatar: Buffer,
  introduction: String,
  roles: {
    type: Array,
    required: true
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User;