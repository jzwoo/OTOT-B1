require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const apiRoutes = require('./api-routes')

// express
const app = express()

// middleware
app.use(express.json())

// routes
app.use('/api/contacts', apiRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, (err) => {
        if (!err)
            console.log(`Example app listening on port ${process.env.PORT}`)
        else
            console.log('Error occurred, server can\'t start');
    })
}).catch((err) => {
    console.log(err)
})
