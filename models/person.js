const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//TODO: Not save password to github
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 4,
        required: true,
        unique: true
    },
    number: {
        type:String,
        required: true
    },
})

personSchema.set('toJSON', { //De esta manera cuando devolvamos un objeto parseado como JSON tendremos el atributo id (necesario en las llamadas desde el front end) y no tendremos los otros atributos que añade mongo
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)