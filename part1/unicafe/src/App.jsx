import { useState } from 'react'

const Button = (props) => {

  return (
    <>
      <button onClick={props.handler}>
        {props.name}
      </button>
    </>
  )
}

const StaticLine = (props) => {

  return (
    <>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </>
  )

}

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad

  return (
    <>

      {total == 0 ? (
        <>
          <p>
            No feedback given
          </p>
        </>
      ) : (
        <>
          <table>
            <tbody>
              <StaticLine text="good" value={props.good} />
              <StaticLine text="neutral" value={props.neutral} />
              <StaticLine text="bad" value={props.bad} />
              <StaticLine text="all" value={total} />
              <StaticLine text="average" value={(props.good - props.bad)/total} />
              <StaticLine text="positive" value={((props.good/total)*100) + "%"} />
            </tbody>
          </table>
        </>
      )}
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodHandler = () => {
    setGood(good + 1)
  }

  const neutralHandler = () => {
    setNeutral(neutral + 1)
  }

  const badHandler = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>
        give feedback
      </h1>
      <Button name={"good"} handler={goodHandler} />
      <Button name={"neutral"} handler={neutralHandler} />
      <Button name={"bad"} handler={badHandler} />
      <h1>
        statistics
      </h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App