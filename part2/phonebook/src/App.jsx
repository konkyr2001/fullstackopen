import { useState, useEffect } from 'react'
import personService from './services/Persons'

const Message = ({ message, successMessage }) => {
  if (!message) {
    return null;
  }

  return (
    <>
      {successMessage ? (
        <div className='success'>{message}</div>
      ) : (
        <div className='remove'>{message}</div>
      )}
    </>
  );
};


const Filter = ({handler}) => {

  return (
    <p>
      filter shown with 
      <input onChange={handler}/>
    </p>
  )
}

const PersonForm = (props) => {

  return (
    <>
      <form onSubmit={props.formHandler}>
        <div>
          name: <input onChange={props.nameHandler}/>
        </div>
        <div>
          number: <input onChange={props.phoneHandler}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Person = ({ id, name, number, action }) => {
  return (
    <div>
      <p>{name} {number}</p>
      <button onClick={action}>Delete</button>
    </div>
  );
};



const Persons = ({ showPersons, action }) => {
  return (
    <div>
      {showPersons.map((person,i) => (
        <Person
          key={i}
          id={person.id}
          name={person.name}
          number={person.number}
          action={() => action(person.id)}
        />
      ))}
    </div>
  );
};




const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [showPersons, setShowPersons] = useState([])
  const [message, setMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [counterHook, setCounterHook] = useState(0);

  const fetchData = async () => {
    try {
      const response = await personService.getAll();
      setPersons(response);
      setShowPersons(response);
      // const arr = personService.getAll()
      // setPersons(arr)
      // setShowPersons(arr)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log("GAMW TO XRISTO SOU")
    fetchData(); // Fetch data on initial mount

    // Set up polling to refresh data every 5 seconds (adjust as needed)
    // const intervalId = setInterval(fetchData, 5000);

    // Cleanup the interval when the component is unmounted
    // return () => clearInterval(intervalId);
  }, [counterHook]);
  const submitForm = (event) => {
    event.preventDefault();
    let copy = [...persons];

    let existsName = false;
    let existsNumber = false;
    copy.map(element => {
      if (element["name"] === newName) {
        existsName = true;
      }

      if (element["number"] === newNumber) {
        existsNumber = true;
      }
    })


    if (existsName === true) {
      // alert(newName + " is already added to the phonebook");
      const element = copy.find(person => person.name === newName);
      if (window.confirm(`${element.name} is already added to phonebook, replace
      the old number with a new one?`)) {
        element.number = newNumber;
        console.log(element.id)
        console.log(element)
        personService
          .update(element.id, element)
          .then(response => {
            setPersons(copy.map(person => person.name !== newName ? person : 
              response))

          })
          .catch(response => {
            setMessage(`Information of ${newName} has already been removed from server`)
            setSuccessMessage(false)
            console.log("update catch")
            console.log(response)
          })
      } else {
        return;
      }
      // i add the copy array and not the persons beacuse persons is asynchronus
      if (filterName === "") {
        setShowPersons(copy);
      } else {
        const filter = (filterName).toLowerCase();
  
        const arr = copy.filter((element) =>
          element.name.toLowerCase().includes(filterName.toLowerCase())
        );
        console.log(arr)
        setShowPersons(arr);
      }
      
    } else {
      const newObject = {name: newName, number: newNumber}

      personService
      .create(newObject)
      .then(response => {
        const newArr = copy.map(person => person.name !== response.name ? person:response)
        setPersons(newArr);
        // console.log(copy.filter(person => person.name === response.name ? reponse:person))
      })
      .catch(response => {
        console.log("create catch")
      })

      copy = copy.concat(newObject);
      setPersons(copy);
      
      // i add the copy array and not the persons beacuse persons is asynchronus
      if (filterName === "") {
        setShowPersons(copy);
      } else {
        const filter = (filterName).toLowerCase();
  
        const arr = copy.filter((element) =>
          element.name.toLowerCase().includes(filterName.toLowerCase())
        );
        console.log(arr)
        setShowPersons(arr);
      }
    }
    setMessage(`Added ${newName}`)
    setSuccessMessage(true)

    setTimeout(() => {
      setMessage(``)
      setSuccessMessage()
    }, 3000)
    
    setCounterHook(counterHook)
  }

  const deletePerson = (id) => {
    const element = showPersons.find(person => person.id === id)
    if (window.confirm(`Delete ${element.name} ?`)) {
      personService
        .remove(id)
        .then(data => {
          setPersons(persons.filter(person => person.id !== id))
          setShowPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.log('remove catch')
          console.log(error)
        })
        setMessage(`Deleted ${element.name}`)
        setSuccessMessage(false)
    
        setTimeout(() => {
          setMessage(``)
          setSuccessMessage()
        }, 3000)
    }
    setCounterHook(prevCounter => prevCounter + 1);

  }

  const changeName = (event) => {
    setNewName(event.target.value);
  }

  const changeNumber = (event) => {
    setNewNumber(event.target.value);
  }

  const searchName = (event) => {
    const text = event.target.value; // we use text beacuse filterName is asynchronus
    setFilterName(text);
    if (text === "") {
      setShowPersons(persons);
    } else {
      const filter = (text).toLowerCase();

      const arr = persons.filter((element) =>
        element.name.toLowerCase().includes(text.toLowerCase())
      );
      setShowPersons(arr);
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} successMessage={successMessage} />
      <Filter handler={searchName} />
      <h3>Add a new</h3>
      <PersonForm formHandler={submitForm} nameHandler={changeName} phoneHandler={changeNumber} />
      <h2>Numbers</h2>
      <Persons showPersons={showPersons} action={deletePerson}/>
    </div>
  )
}

export default App