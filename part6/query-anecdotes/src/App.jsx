import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, newAnecdote, updateAnecdote } from './requests'
import { useState } from 'react'
import { CounterContextProvider } from './CounterContext'

const App = () => {
  const queryClient = useQueryClient()
  const [ message, setMessage ] = useState('')
  const [ showMessage, setShowMessage ] = useState(false)

  const addAnecdote = useMutation({
    mutationFn: newAnecdote,
    onSuccess: (newAnecdote) => {
      console.log(newAnecdote)
      const currentAnecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], currentAnecdotes.concat(newAnecdote))
    }
  })

  const voteAnecdote = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    }
  })

  const handleVote = (anecdote) => {
    anecdote.votes += 1
    voteAnecdote.mutate(anecdote)
    setMessage('anecdote "' + anecdote.content + '" has been voted')
    setShowMessage(true)
    setTimeout(() => {
      setMessage('')
      setShowMessage(false)
    }, 5000)
  }
  const addNewAnecdote = (newAnecdote) => {
    addAnecdote.mutate(newAnecdote)
    if (newAnecdote.content.length > 5) {
      setMessage(newAnecdote.content + ' has been added')
    } else {
      setMessage('too short anecdote, must have length 5 or more')
    }
    setShowMessage(true)
    setTimeout(() => {
      setMessage('')
      setShowMessage(false)
    }, 5000)

  }
  const result = useQuery(
    {
      queryKey: ['anecdotes'],
      queryFn: getAnecdotes,
    }
  )

  if (result.isLoading) {
    return <span>Loading...</span>
  }

  if (result.isError) {
    return <span>anecdote service not available due to problems in server</span>
  }
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <CounterContextProvider>
        <Notification message={message} showMessage={showMessage}/>
      </CounterContextProvider>
      <AnecdoteForm addNewAnecdote={addNewAnecdote}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
