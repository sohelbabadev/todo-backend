import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from 'cors'

import * as userRoutes from "./routes/userRoute"
import * as todoRoutes from "./routes/todoRoute"

const dotenv = require('dotenv');
dotenv.config();

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())


mongoose.connect(process.env.DATABASE_URL || "")
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('Error while connecting database',err));

//health check
app.get('/', (req, res) => {
    res.status(200).send('health check TODO APP')
})

//user routes
app.post('/user-registration', userRoutes.userRegistration)
app.post('/auth/login', userRoutes.authentication)

//todo routes
app.post('/create-todo', todoRoutes.createTodo)
app.post('/update-todo',todoRoutes.updateTodo)
app.post('/fetch-todo',todoRoutes.fetchTodo)
app.post('/delete-todo',todoRoutes.deleteTodo)

app.listen(process.env.PORT, () => {
    console.log('Server running on 8000')
})