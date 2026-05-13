require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const id = Math.floor(Math.random() * 50000).toString()
  const person = request.body

  const newPerson = {
    id: id,
    ...person
  }

  new Person(newPerson).save().then(() => {
    response.json(newPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  Person.findById(id).then((person) => {
    if (!person) {
      response.status(404).end()
      return
    }

    person.name = name
    person.number = number

    return person.save().then((updatedPerson) => {
      response.json(updatedPerson)
    })
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then((person) => {
    if (person) {
      response.json(person)
      return
    }

    response.status(404).end()
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then((person) => {
    console.log('deleting by id', id)
    console.log('person', JSON.stringify(person))
    response.status(204).end()
  }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).then((count) => {
    const time = new Date().toString()

    response.send(`Phonebook has info for ${count} people<br><br>${time}`)
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }

  if (error.name == 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`)
})