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
  avatar: {
    data: Buffer,
    contentType: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown']
  },
  phone: String,
  address: String,
  homepage: String,
  company: String,
  education: String,
  introduction: String,
  roles: {
    type: Array,
    default: ['visitor'],
    required: true
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User;