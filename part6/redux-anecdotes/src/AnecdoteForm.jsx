import { useDispatch } from 'react-redux'
import { settingMessage, removingMessage } from './reducers/notificationReducer'
import { addAnecdote } from './reducers/anecdoteReducer'
import { setNotification } from './reducers/notificationReducer'
const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const formHandler = async (event) => {
    event.preventDefault()
    const value = event.target.anecdote.value
    dispatch(addAnecdote(value))
    dispatch(setNotification(`you added '${value}'`, 5000))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={formHandler}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm