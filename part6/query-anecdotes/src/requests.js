import axios from 'axios'

const baseUrl = 'http://localhost:3000/anecdotes'

export const getAnecdotes = async () =>
  await axios.get(baseUrl).then(result => result.data)

export const newAnecdote = async (newAnecdote) => {
  if (newAnecdote.content.length > 5) {
    return await axios.post(baseUrl, newAnecdote).then(result => result.data)
  } else {
    return axios.Cancel()
  }
}

export const updateAnecdote = async (updatedAnecdote) => 
  await axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
  .then(result => result.data)