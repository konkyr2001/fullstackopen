const notesRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

notesRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog
      .find({}).populate('user', ({ username: 1, name: 1}))
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})
  
notesRouter.get('/:id', async (request, response, next) => {
  try{
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

notesRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const content = request.body

  try{
    const blogUser = request.user

    const blog = new Blog({
      title: content.title,
      author: content.author,
      url: content.url,
      likes: content.likes,
      user: blogUser.id
    })

    const result = await blog.save()
    blogUser.blogs = blogUser.blogs.concat(result._id)
    await blogUser.save()
    response.status(201).json(result).end()
  } catch (exception) {
    next(exception)
  }
})
  
notesRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const blogId = request.params.id
  console.log('mpike delete')
    try {
    console.log('1')
    const user = request.user

    console.log('2')
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return response.status(400).json({ error: 'user not found' }).end()
    }
    console.log('3')
    console.log(user)
    if (blog.user.toString() != user.id.toString()) {
      return response.status(400).json({ 
        error: 'this token doesnt belong to this blog'
      }).end()
    }
    console.log('4')

    await Blog.findByIdAndDelete(blogId)
    console.log('5')
    response.status(204).end()
  } catch (exception) {
    console.log('catch')
    console.log(exception)
    // next(exception)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const content = request.body
  const blogId = request.params.id

  const blog = {
    title: content.title,
    author: content.author,
    url: content.url,
    likes: content.likes
  }

  try {
    await Blog.findByIdAndUpdate(blogId, blog, {new: true})
    response.status(200).json(blog).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = notesRouter