require("dotenv").config()
const PersonNote = require("./mongo")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const PORT = process.env.PORT || 3001


const app = express()
app.use(express.static("dist"))

app.use(morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === "POST") {}
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.method(req, res) === "POST"?
        JSON.stringify(req.body):null
      ].join(' ')
}))


app.use(express.json())
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    PersonNote.find({}).then(persons => {
            response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const requestDate = new Date();
    response.send(
        `<p>Phonebook has info for ${PersonNote.length} people</p>
        <p>Request received at: ${requestDate}</p>`
    );
});

app.get('/api/persons/:id', (request, response, next) => {
    PersonNote.findById(request.params.id)
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                console.log("mpike else")
                response.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    PersonNote.findByIdAndDelete(request.params.id)
        .then(result => {
            console.log("deleted")
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
  })

app.post('/api/persons', (request, response, next) => {
    const newPerson = request.body
    newPerson.id = Math.floor((Math.random() * 1000) + 1)

    if (newPerson.name === undefined && newPerson.number === undefined) {
        response.status(404).json({ error: 'name and number must be defined!' }).end()
        return
    } else if (newPerson.name === undefined) {
        response.status(404).json({ error: 'name must be defined!' }).end()
        return
    } else if (newPerson.number === undefined) {
        response.status(404).json({ error: 'number must be defined!' }).end()
        return
    }
    
    PersonNote.findOne({name: newPerson.name})
        .then(result => {
            if (result) { // replace the number of the current name
                result.number = newPerson.number
                result.save()
                    .then(savedPerson => {
                        response.json(savedPerson)
                    })
                    .catch(error => {
                        
                        next(error)
                    })
            } else { // create new person
                const person = new PersonNote({
                    name: newPerson.name,
                    number: newPerson.number
                })

                person.save()
                    .then(savedPerson => {
                        response.json(savedPerson)
                    })
                    .catch(error => {
                        next(error)
                    })
            }
        })
        .catch(result => {
            response.json(savedPerson)
        })
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } 
    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    } 
    if (error.name === 'ParallelValidateError') {
        return response.status(400).send({ error: error.message })
    } 
    next(error)
}
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})