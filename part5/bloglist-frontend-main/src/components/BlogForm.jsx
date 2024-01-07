import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm
 = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = async (event) => {
    event.preventDefault()
    await handleNewBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addNewBlog}>
        <label htmlFor='title'>title: </label>
        <input
          type='text'
          value={title}
          name='title'
          id='title-input'
          onChange={({ target }) => {setTitle(target.value)}}
        />
        <br></br>
        <label htmlFor='author'>author: </label>
        <input
          type='text'
          value={author}
          name='author'
          id='author-input'
          onChange={({ target }) => {setAuthor(target.value)}}
        />
        <br></br>
        <label htmlFor='url'>url: </label>
        <input
          type='text'
          value={url}
          name='url'
          id='url-input'
          onChange={({ target }) => {setUrl(target.value)}}
        />
        <br></br>
        <button id='create-button' type='submit'>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleNewBlog: PropTypes.func.isRequired
}

export default BlogForm