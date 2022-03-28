const express = require('express');
const res = require('express/lib/response');
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
  res.send('This is the emrex/elmo converter, developed for the IDUnion project. Check <a href="https://github.com/pherbke/elmo-converter#api-wip">https://github.com/pherbke/elmo-converter#api-wip</a> for infos and API')
})

process.on('uncaughtException', function (err) {       
  console.log(err);
  //Send some notification about the error  
  res.send("An unexpected error occured. Restarting application...")
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Converter listening at http://localhost:${port}`)
})

