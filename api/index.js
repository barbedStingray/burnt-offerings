const express = require('express')
require('dotenv').config()
const app = express()
const path = require('path')



// todo Route includes

// express middleware
app.use(express.json())

// todo express routes

// serve the static files
app.use(express.static(path.join(__dirname, '..', 'build')))

// requests that don't match above routes
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

// app set
const PORT = process.env.PORT || 5076

// listen
app.listen(PORT, () => {
    console.log('listening on port:', PORT)
})

// export the app for vercel
module.exports = app


