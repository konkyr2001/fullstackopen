import { useState, useEffect } from 'react'
import axios from 'axios'

const api_weather_key = import.meta.env.VITE_SOME_KEY
// const api_weather_key = "a06a829af207512c8224ed0302c4aa15"
const CountryDetails = ({display, name, capital, area, languages, png}) => {
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [wind, setWind] = useState('');
  const [icon, setIcon] = useState('');

  if (display === false) {
    return;
  }

  {axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_weather_key}&units=metric`)
    .then(response => {
      console.log(api_weather_key)
      console.log(response.data.wind)
      setTemperature(response.data.main.temp)
      setWeather(response.data.weather[0].main)
      setIcon(response.data.weather[0].icon)
      setWind(response.data.wind.speed)
    })
    .catch(response => {
      console.log("Error: " + response)
    })
  }

  return (
    <>
      <h1>{name}</h1>
      capital: {capital}
      <br></br>
      area: {area}
      <h4>languages: </h4>
      <ul>
        {Object.values(languages).map((language, id) => <li key={id}>{language}</li>)}
      </ul>
      <img src={png}/>
      <h1>Weather in {capital}</h1>
      Temperature: {temperature} Celcius <br></br>
      Weather: {weather}<br></br>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} /><br></br>
      Wind: {wind} m/s<br></br>
    </>
  )
}

const App = () => {
  const [name, setName] = useState('')
  const [countries, setCountries] = useState([])
  const [display, setDisplay] = useState([])

  useEffect(() => {
    console.log('effect run, currency is now')

    // skip if currency is not defined
    if (name == "")
      return;

    console.log('fetching exchange rates... ',name)
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        console.log(response.data)

        const flag = (response.data).filter(data => data.name.common.toLowerCase().includes(name.toLowerCase()))

        console.log(flag)
        const displayFlag = flag.map(data => false)
        setDisplay(displayFlag)
        setCountries(flag);
      })
  }, [name])

  const handleChange = (event) => {
    setName(event.target.value)
  }

  const clickButton = (index) => {
    const copy = [...display];
    copy[index] = !copy[index];
    setDisplay(copy);
    console.log(index)
    console.log(copy)
    console.log(countries)
  }
  
  return (
    <div>
      find countries: <input onChange={handleChange} />
      <pre>
        {countries.length > 10 ? (
          "Too many matches, specify another filter"
        ) : countries.length > 1 ? (
          countries.map((data, index) => (
            <div key={index}>
              {data.name.common}
              <button onClick={() => clickButton(index)}>{display[index]?"hide":"show"}</button>
              <CountryDetails
                display={display[index]}
                name={countries[index].name.common} 
                capital={countries[index].capital} 
                area={countries[index].area} 
                languages={countries[index].languages} 
                png={countries[index].flags.png}
              />
              <br></br>
            </div>
          )).sort()
        ) : countries.length == 1 ? (
            <CountryDetails
              display={true}
              name={countries[0].name.common} 
              capital={countries[0].capital} 
              area={countries[0].area} 
              languages={countries[0].languages} 
              png={countries[0].flags.png}
            />
        ) : null }
      </pre>
    </div>
  )
}

export default App