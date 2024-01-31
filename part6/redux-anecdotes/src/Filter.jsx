import { useDispatch } from "react-redux"
import { searchByInput } from "./reducers/filterReducer"

const Filter = () => {
  const dispatch = useDispatch()
  const inputHandler = (event) => {
    dispatch(searchByInput(event.target.value))
  }

  const style = {
    marginBottom: 20
  }
  
  return (
    <div style={style}>
      filter <input  onChange={inputHandler}/>
    </div>
  )
}

export default Filter