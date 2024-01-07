const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const tokenExtractor = (request, response, next) => {
  try{
    let token = request.get('authorization')
    console.log('request.get(authorization): ',request.get('authorization'))
    if (token && token.startsWith('Bearer ')) {
      token = token.replace('Bearer ','')
      request.token = token
    } else {
      request.token = null
    }
  } catch (exception) {
    next(exception)
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const token = jwt.verify(
    request.token,
    process.env.SECRET
  )
  try {
    request.user = await User.findById(token.id)
    console.log('user: ',request.user)
    next()
  } catch (exception) {
    request.user = null
    next(exception)
  }
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token must be provided' })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}