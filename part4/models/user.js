const { transform } = require("lodash")
const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minLength: 3
  },
  hashedPassword: {
    type: String
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.password
    delete returnedObject.hashedPassword
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User