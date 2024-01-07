import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikesOfBlog, deleteBlog, username }) => {
  const [visibility, setVisibility] = useState(false)

  const buttonText = visibility ? 'hide' : 'view'
  const view = { display: visibility ? '' : 'none' }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const updateLikes = () => {
    updateLikesOfBlog(blog)
  }

  const removeBlog = () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    } else {
      return
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} class='blog'>
      <div className='display'>
        Title: {blog.title} Author: {blog.author} <button onClick={toggleVisibility}>{buttonText}</button>
      </div>
      <div style={view} className='details'>
        <p>
          {blog.url}
        </p>
        <p>
          likes: {blog.likes} <button onClick={updateLikes}>like</button>
        </p>
        <p>
          {blog.user.username}
        </p>
        {username === blog.user.username && <button onClick={removeBlog}>remove</button>}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog