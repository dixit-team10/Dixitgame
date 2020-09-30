const express = require('express')
const path = require('path')
const http = require('http')


require('dotenv/config')

const morgan = require('morgan')


//initiate express application
const app = express()

//connect to mongodb
const mongoose = require('mongoose')
const dbURL = process.env.mongoUrl
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    err && console.log('connection failed')
    !err && console.log('Connected Successfully!')
})



//start server listener on port 3000
http.createServer(app).listen('3000', () => {
    console.log('server listening on port 3000')
})