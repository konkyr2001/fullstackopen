import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const buttonsHandler = (event) => {
    const action = (event.target.innerText).toString().toUpperCase()
    if (action === 'RESET STATS') {
      store.dispatch({
        type: 'ZERO'
      })
    } else {
      store.dispatch({
        type: action
      })
    }
    
  }
  const good = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }

  return (
    <div>
      <button onClick={buttonsHandler}>good</button> 
      <button onClick={buttonsHandler}>ok</button> 
      <button onClick={buttonsHandler}>bad</button>
      <button onClick={buttonsHandler}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
