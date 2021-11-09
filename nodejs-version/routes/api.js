// path: api/
const express = require('express')
const router = express.Router()

const xmlparser = require('express-xml-bodyparser');
const fs = require('fs');
const xml2js = require('xml2js');
const credentialParser = require('../utils/credentialParser') 

const parseOptions = {
    explicitArray: false,
    trim: true
}
const XMLParser = new xml2js.Parser(parseOptions);

router.get('/', (req, res, next) => {
    res.send("please post xml file to /api/convert")
})

router.get('/print/:fileName', (req, res, next) => {
    let text = fs.readFileSync("../" + req.params.fileName + ".xml", "utf-8") 

    XMLParser.parseStringPromise(text)
    .then((data, error) => {
        if (error) {
            console.log(error)
            return
        }
        if (error) {console.log(error)}
        res.set("Content-Type", "application/json")
        res.send(JSON.stringify(data))
    })
})

// reads local file :filename and uses that as input
router.get("/convert/:fileName", (req, res, next) => {
    let text = fs.readFileSync("../" + req.params.fileName + ".xml", "utf-8") 

    XMLParser.parseStringPromise(text)
    .then((data, error) => {
        if (error) {
            console.log(error)
            res.send("There was an error parsing your file:"+error)
        }
        res.set("Content-Type", "application/json")
        res.send(JSON.stringify(credentialParser(data)))
    })
})

router.post('/convert', xmlparser({trim: false, explicitArray: false}), (req, res, next) => {
    console.log(req.body)
    XMLParser.parseStringPromise(req.body)
    .then((data, error) => {
        if (error) {
            console.log(error)
            res.send("There was an error parsing your file:"+error)
        }
        res.set("Content-Type", "application/json")
        res.send(JSON.stringify(credentialParser(data)))
    })
})

module.exports = router;