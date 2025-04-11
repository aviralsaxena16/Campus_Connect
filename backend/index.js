import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app=express()

app.use(cors())

app.use(express.json())

mongoose.connect('mongodb+srv://aviralsaxena2006:dn2wEQyYJmAOM438@cluster0.elh7l9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {useNewUrlParser: true, useUnifiedTopology: true})


app.get('/register', (req, res) => {
    
})

app.listen(3000, () => 
    console.log('Server running on port 3000'))