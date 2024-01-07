const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User
      .find({}).populate('blogs', {
        url: 1,
        title: 1,
        author: 1
      })
    response.json(users).status(200).end()
  } catch (exception) {
    next(exception)
  }
})

userRouter.post('/', async (request, response, next) => {
  const body = request.body

  let hashCode = ""
  if (body.password) {
    hashCode = bcrypt.hashSync(body.password, 10)
  }

  const user = new User({
    username: body.username,
    name: body.name,
    password: body.password,
    hashedPassword: hashCode,
  })

  try {
    const savedUser = await user.save()
    response.json(savedUser).status(201).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = userRouter