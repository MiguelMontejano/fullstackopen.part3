require('dotenv').config()
const {request, response} = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

//Token personalizado
morgan.token('body'/*Name of token*/, (request) => JSON.stringify(request.body))

//Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})

app.get('/info', (request, response) => {
    const date = new Date()
    let numberPersons
    Person.count({})
        .then(persons => {
            response.end(`
            <p>Phonebook has info for ${persons} people</p>
            <p>${date}</p>              
            `)
        })
        .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPhone => {
            response.json(updatedPhone)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

//Manejador de errores, son middlewares que aceptan 4 parametros, esto lo tenemos que poner siempre abajo de 
//de los metodos que lo pueden llamar, si no no tendrá efecto
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError'){ //Error por id no valido para Mongo
        return response.status(400).send({error: 'malformatted id'})
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }else if(error.name === 'MongoServerError'){
        return response.status(400).json({error: error.message})
    }

    next(error)//Pasamos el error al controlador de errores de Express predeterminado
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})