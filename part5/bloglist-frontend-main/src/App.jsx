import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [messageStatus, setMessageStatus] = useState(false)


  useEffect(() => {
    blogService
      .getAll().then(initialNotes => {
        setBlogs(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      setMessage(`Welcome ${user.name}`)
      setMessageStatus(true)
      setTimeout(() => {
        setMessage('')
      }, 3000)
    } catch (exception) {
      console.log(112)
      setMessage('wrong username or password')
      setMessageStatus(false)
      setTimeout(() => {
        setMessage('')
      }, 3000)
    }
  }

  const logout = () => {
    localStorage.removeItem('loggedUser')
    setUser('')
    blogService.setToken(null)
  }

  const viewForm = () => {
    return (
      <>
        <form onSubmit={handleLogin}>
          <label>username: </label>
          <input
            type='text'
            value={username}
            name='username'
            onChange={({ target }) => {setUsername(target.value)}}
            id='username-input'
          />
          <br></br>
          <label>password: </label>
          <input
            type='password'
            value={password}
            name='password'
            onChange={({ target }) => {setPassword(target.value)}}
            id='password-input'
            ></input>
          <br></br>
          <button type='submit'>login</button>
        </form>
      </>
    )
  }

  const handleNewBlog = (blogObject) => {
    console.log(blogObject)
    blogService.create(blogObject)
      .then(returnedBlog => {
        console.log(blogs.concat(blogObject))
        setBlogs(blogs.concat(returnedBlog))

        setMessage(`new blog ${returnedBlog.title} by ${returnedBlog.author} has been added`)
        setMessageStatus(true)
        setTimeout(() => {
          setMessage('')
        }, 3000)
      })
      .catch(exception => {
        console.log("mpike gamimeno catch ",exception)
        setMessage()
        setMessageStatus(false)
        setTimeout(() => {
          setMessage('')
        }, 3000)
      })
  }

  const updateLikesOfBlog = (newBlog) => {
    console.log('updateLikesOfBlog: ',blogs)
    const copy = [...blogs]
    newBlog.likes = newBlog.likes + 1
    blogService.update(newBlog)
      .then(returnedBlog => {
        setBlogs(copy)

      })
  }

  const deleteBlog = (blog) => {
    const copy = [...blogs]
    copy.splice(copy.indexOf(blog),1)
    blogService.remove(blog)
      .then(returnedBlog => {
        setBlogs(copy)
        setMessage(`the blog ${blog.title} by ${blog.author} has been deleted`)
        setMessageStatus(true)
        setTimeout(() => {
          setMessage('')
        }, 3000)
      })
      .catch(error => {
        console.log('error catch delete')
        setMessage(error.message)
        setMessageStatus(true)
        setTimeout(() => {
          setMessage('')
        }, 3000)
      })
  }

  const createBlogs = () => {
    return (
      <div>
        <Togglable buttonLabel='create new blog'>
          <BlogForm handleNewBlog={handleNewBlog} />
        </Togglable>
      </div>
    )
  }

  const viewBlogs = () => {
    blogs.sort((a, b) => b.likes - a.likes)
    return (
      <>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            username={user.username}
            updateLikesOfBlog={updateLikesOfBlog}
            deleteBlog={deleteBlog} />
        )}
      </>
    )
  }

  return (
    <div>
      <Notification status={messageStatus} message={message}></Notification>
      {user === ''? (
        <div>
          <h2>log in to application</h2>
          {viewForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          {user.username} logged in
          <button
            onClick={logout}
          >logout</button>
          {createBlogs()}
          {viewBlogs()}
        </div>
      )}

    </div>
  )
}

export default App