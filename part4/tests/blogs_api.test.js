const mongoose = require('mongoose').set("bufferTimeoutMS", 30000)
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const { MongoUnexpectedServerResponseError } = require('mongodb')
const User = require('../models/user')

let token 
beforeEach(async () => {
  await Blog.deleteMany({})

  const newBlog = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = newBlog.map(blog => blog.save())
  await Promise.all(promiseArray)
  
  const user = helper.initialUser
  await api
    .post('/api/users')
    .send(user)

  const login = await api
    .post('/api/login')
    .send({
      username: user.username,
      password: user.password
    })

  token = login.body.token
})

describe('HTTP GET post', () => {
  test('HTTP GET all posts to json', async () => {
    await api 
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Checking objects properties', () => {
  test('Blog property is id and not _id', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;

    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
      expect(blog._id).toBeUndefined();
    })
  }) 
})

describe('HTTP POST requests', () => {
  test('add a blog to the database', async () => {
    const newBlog = {
      title: 'O mpampas sas',
      author: 'Kostasa',
      url: 'www.kostasa.gr',
      likes: -1
    }
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDatabase()
    expect(blogs.length).toBe(helper.initialBlogs.length + 1)
  })

  test('initialize a blog with likes undefined to 0', async () => {
    const noLikesBlog = {
      title: 'O mpampas sas',
      author: 'Kostasa',
      url: 'www.kostasa.gr',
    }
    
    const response = await api
      .post('/api/blogs')
      .send(noLikesBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const item = response.body
    expect(item.likes).toBe(0)
  })

  test('error 400 when adding a blog with no url', async () => {
    const noUrlBlog = {
      title: 'O mpampas sas',
      author: 'Kostasa',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(noUrlBlog)
      .expect(400)

  })

  test('error 400 when adding a blog with no title', async () => {
    const noTitleBlog = {
      author: 'Kostasa',
      url: 'www.kostasa.gr',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(noTitleBlog)
      .expect(400)

  })

  test('token is not provided, error 401', async () => {
    const blog = {
      title: 'Lets do this',
      author: 'Kostasa',
      url: 'www.kostasa.gr',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
  })
})

describe('HTTP DELETE request', () => {
  test('Delete a blog from the database', async () => {
    const blogs = await helper.blogsInDatabase()
    const deleteBlog = {
      title: 'test',
      author: 'test',
      url: 'test',
      likes: 1
    }

    const blog = await api
      .post('/api/blogs')
      .send(deleteBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogs2 = await helper.blogsInDatabase()
    expect(blogs2.length).toBe(blogs.length + 1)

    await api
      .delete(`/api/blogs/${blog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const newBlogs = await helper.blogsInDatabase()
    expect(newBlogs.length).toBe(blogs.length)
    expect(newBlogs).not.toContain(blog)
  })
})

describe('HHTP PUT request', () => {
  test('Update likes about an existing blog', async () => {
    const blogsBefore = helper.initialBlogs
    const blogs = await helper.blogsInDatabase()
    blogs[0].likes = 200

    await api
      .put(`/api/blogs/${blogs[0].id}`)
      .send(blogs[0])
      .expect(200)

    const newBlogs = await helper.blogsInDatabase()

    expect(newBlogs.length).toBe(blogs.length)
    expect(blogs[0].likes).not.toBe(blogsBefore[0].likes)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})