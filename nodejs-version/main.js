const express = require('express')
const logger = require('morgan');

const app = express()
const port = 8081

// Routes
const apiRouter = require('./routes/api')

// logger and format middleware
app.use(logger('dev'))

app.use(
  express.urlencoded({
    extended: true
  })
)
//app.use(express.json())

// APP
app.use('/api', apiRouter)

app.get('/', (req, res) => {
  res.send('This is the emrex/elmo converter. Send XML file via post at /api/convert')
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})