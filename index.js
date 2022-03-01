const {request, response} = require('express')
const express = require('express')
const morgan = require('morgan')

const app = express()

//Token personalizado
morgan.token('body'/*Name of token*/, (request) => JSON.stringify(request.body))

//Middlewares
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.end(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>              
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(id);
    console.log(persons);

    response.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * 600000)
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number missing"
        })
    }

    let duplicated = persons.find(person => person.name === body.name)
    if(duplicated){
        return response.status(400).json({
            error: "The name is already on the phonebook"
        }) 
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})