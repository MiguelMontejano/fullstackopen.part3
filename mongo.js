const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5){
    console.log('Please provide the password as an argument: node mongo.js <password> or a password and the new phone: node mongo.js <password> <name> <phone>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@pruebacluster.tag76.mongodb.net/phone-app?retryWrites=true&w=majority`

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

if(process.argv.length === 5){
    const phone = new Phone ({
        name: process.argv[3],
        number: process.argv[4],
    })

    phone.save().then(result => {
        console.log(`added ${phone.name} number ${phone.number} to phonebook`);
        mongoose.connection.close()
    })
}

if(process.argv.length === 3){
    Phone.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}