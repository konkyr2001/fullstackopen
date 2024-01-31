import { createSlice } from '@reduxjs/toolkit'

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const notificationSlide = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    settingMessage(state, action) {
      return action.payload
    },
    removingMessage(state, action) {
      return '';
    }
    
  }
})

export const { settingMessage, removingMessage } = notificationSlide.actions

export const setNotification = (message, miliseconds) => {
  return async dispatch => {
    dispatch(settingMessage(message))
    setTimeout(() => {
    dispatch(removingMessage(message))
    }, miliseconds)
  }
}

export default notificationSlide.reducer