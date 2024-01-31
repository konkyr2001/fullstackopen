import { useSelector, useDispatch } from "react-redux"
import { increaseVoteOfAnecdote, voteAnecdote } from "./reducers/anecdoteReducer"
import { settingMessage, removingMessage } from "./reducers/notificationReducer"
import { setNotification } from './reducers/notificationReducer'
import store from './store'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdote, filter }) => {
    if (!filter)
      return anecdote

    return anecdote.filter(element => {
      return element.content.toLowerCase().
        includes(filter.toLowerCase()) ? element.content : null
    })
  })
  const sortAnecdotes = [...anecdotes]
  sortAnecdotes.sort((a, b) => {
    return b.votes - a.votes
  })

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5000))
  }
  return (
    <div>
      {sortAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList