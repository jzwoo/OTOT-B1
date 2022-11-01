import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import User from './model/userModel.js'
import contactsApiRoutes from './routes/contacts-api-routes.js'
import userApiRoutes from './routes/user-api-routes.js'

import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const port = process.env.PORT || 3001
// express
const app = express()

// config cors so that front-end can use
app.use(cors())
app.options("*", cors())

// middleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
        }
        res.locals.loggedInUser = await User.findById(userId); next();
    } else {
        next();
    }
});

// Can be used to see what method and path was used
// app.use((req, res, next) =>{
//     console.log(req.method)
//     console.log(req.path)
//     next()
// })

// routes
app.use('/api/contacts', contactsApiRoutes)
app.use('/api/user', userApiRoutes)

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
