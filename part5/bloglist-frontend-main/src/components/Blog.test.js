import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let blog
beforeEach(() => {
  blog = {
    title: 'title',
    author: 'author',
    url: 'google.gr',
    likes: 10,
    user: {
      username: 'kostas'
    }
  }

})

describe('Checking blog content', () => {

  test('Show ONLY title and author by default', async () => {
    const container = render(<Blog blog={blog} />).container

    const display = screen.getByText('Title: title Author: author')
    expect(display).toBeDefined()


    const detailsDiv = container.querySelector('.details')
    expect(detailsDiv).toHaveStyle('display: none')

    const url = screen.getByText('google.gr')
    expect(url).not.toBeVisible()
    
    const likes = screen.getByText('likes: 10')
    expect(likes).not.toBeVisible()
  })

  test('Show likes and url when view button is clicked', async () => {
    const mockButton = jest.fn()
    const container = render(<Blog blog={blog} toggleVisibility={mockButton}/>).container
    
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    
    const detailsDiv = container.querySelector('.details')
    expect(detailsDiv).toHaveStyle('display: block')

    const url = screen.getByText('google.gr')
    expect(url).toBeVisible()
    
    const likes = screen.getByText('likes: 10')
    expect(likes).toBeVisible()

  })

  test('If like button is clicked twice the event handler is called twice', async() => {
    const mockVisibilityButton = jest.fn()
    const mockLikeButton = jest.fn()

    render(
      <Blog blog={blog} toggleVisibility={mockVisibilityButton} updateLikesOfBlog={mockLikeButton}/>
    )

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockLikeButton.mock.calls).toHaveLength(2)
  })
})