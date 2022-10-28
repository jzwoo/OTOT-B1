import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/api-routes.js'

const port = process.env.PORT || 3000
// express
const app = express()

// middleware
app.use(express.json())
// Can be used to see what method and path was used
// app.use((req, res, next) =>{
//     console.log(req.method)
//     console.log(req.path)
//     next()
// })

// routes
app.use('/api/contacts', apiRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, (err) => {
        if (!err)
            console.log(`Example app listening on port ${port}`)
        else
            console.log('Error occurred, server can\'t start');
    })
}).catch((err) => {
    console.log(err)
})

export default app;
