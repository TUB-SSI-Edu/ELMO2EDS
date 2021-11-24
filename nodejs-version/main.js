const express = require('express')
const logger = require('morgan');

const app = express()
const port = 8081

// Routes
const xmlRouter = require('./routes/fromXML')

// logger and format middleware
app.use(logger('dev'))

app.use(
  express.urlencoded({
    extended: true
  })
)
//app.use(express.json())

// APP
app.use('/api/xml/', xmlRouter)

app.get('/', (req, res) => {
  res.send('This is the emrex/elmo converter. Send XML file via post at /api/convert')
})



app.listen(port, () => {
  console.log(`Converter listening at http://localhost:${port}`)
})