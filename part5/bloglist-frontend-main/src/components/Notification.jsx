import PropTypes from 'prop-types'

const Notification = ({ status, message }) => {
  if (!message) {
    return null
  }

  return (
    (!status ? (
      <div className='error'>
        {message}
      </div>
    ) : (
      <div className='success'>
        {message}
      </div>
    ))
  )
}

export default Notification