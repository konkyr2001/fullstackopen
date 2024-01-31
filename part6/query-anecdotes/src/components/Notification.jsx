import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Notification = ({ message, showMessage }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const [notification, dispatch] = useContext(CounterContext)
  if (showMessage) {
    dispatch({ payload: message })
  } else {
    return
  }
  
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
