const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First Test title',
    author: 'First Test author',
    url: 'First Test url',
    likes: 1
  },
  {
    title: 'Second Test title',
    author: 'Second Test author',
    url: 'Second Test url',
    likes: 2
  },
  {
    title: 'Third Test title',
    author: 'Third Test author',
    url: 'Third Test url',
    likes: 3
  }
]

const initialUser = {
  username: 'kostasa',
  name: 'kostasa',
  password: 'kostasa'
}

const blogsInDatabase = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDatabase = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUser,
  blogsInDatabase,
  usersInDatabase
}