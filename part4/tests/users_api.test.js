const mongoose = require('mongoose').set("bufferTimeoutMS", 30000)
const express = require('express')
const app = require('../app')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const userPassword = 'password'

  const user = new User({
    username: 'tests',
    name: 'test',
    password: userPassword,
    hashedPassword: bcrypt.hashSync(userPassword, 10)
  })

  await user.save()

})

describe('Requirements for adding a user are not completed', () => {
  test('No username or password', async () => {
    const noPassword = {
      nickname: "kostasa",
      name: "name"
    }
    
    await api
      .post('/api/users')
      .send(noPassword)
      .expect(400)

    const noUsername = {
      name: "name",
      password: "kostasa"
    }

    await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)
  })

  test('Username or password are too short', async () => {
    const shortUsername = {
      nickname: "ko",
      name: "name",
    }

    await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)

    const noPassword = {
      name: "name",
      password: "ko"
    }

    await api
      .post('/api/users')
      .send(noPassword)
      .expect(400)
  })

  test('Username must be unique', async () => {
    const user = {
      username: 'tests',
      name: 'different',
      password: 'different'
    }

    await api 
      .post('/api/users')
      .send(user)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})