import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice ({
  name: 'anecdote',
  initialState: [],
  reducers: {
    increaseVoteOfAnecdote(state, action) {
      const id = action.payload.id
      const element = state.find(state => state.id == id)
      element.votes++
    },
    
    addNewAnecdote(state, action) {
      state.push(action.payload)
    },

    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { addNewAnecdote, increaseVoteOfAnecdote, setAnecdotes } = anecdoteSlice.actions

//Thunk redux
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = (value) => {
  return async dispatch => {
    const newObject = await anecdoteService.createNew(value)
    dispatch(addNewAnecdote(newObject))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const id = anecdote.id
    const object = {
      content: anecdote.content,
      votes: anecdote.votes + 1
    }
    const updatedObject = await anecdoteService.update(id, object)
    console.log(updatedObject)
    dispatch(increaseVoteOfAnecdote(updatedObject))
  }
}

export default anecdoteSlice.reducer