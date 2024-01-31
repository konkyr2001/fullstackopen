const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'GOOD':
      return {
        ...state,  // Spread the existing state
        good: state.good + 1  // Update the 'good' property
      }
    case 'OK':
      return {
        ...state,  // Spread the existing state
        ok: state.ok + 1  // Update the 'good' property
      }
    case 'BAD':
      return {
        ...state,  // Spread the existing state
        bad: state.bad + 1  // Update the 'good' property
      }
    case 'ZERO':
      return initialState
    default: return state
  }
  
}

export default counterReducer
