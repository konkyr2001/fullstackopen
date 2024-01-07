import React from 'react'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('Right details on even handler when blog is created', async () => {
  const mockHandler = jest.fn()
  const container = render(<BlogForm handleNewBlog={mockHandler} />).container

  const user = userEvent.setup()

    const title = container.querySelector('input[name=title]')
    const author = container.querySelector('input[name=author]')
    const url = container.querySelector('input[name=url]')

  await user.type(title, 'title')
  await user.type(author, 'author')
  await user.type(url, 'url')

  await waitFor(() => {
    const create = screen.getByText('create')
    create.click()
  })

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('title')
  expect(mockHandler.mock.calls[0][0].author).toBe('author')
  expect(mockHandler.mock.calls[0][0].url).toBe('url')
})