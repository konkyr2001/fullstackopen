import { useState } from 'react'
import PropTypes from 'prop-types'
const Togglable = (props) => {
  const [visibility, setVisibility] = useState(false)

  const dontShowContainer = { display: visibility ? 'none' : '' }
  const showContainer = { display: visibility ? '' : 'none' }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  return (
    <div>
      <div style={dontShowContainer}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showContainer}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable