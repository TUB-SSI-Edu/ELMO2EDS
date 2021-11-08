// path: api/
const express = require('express')
const router = express.Router()
const fs = require('fs');
const { send } = require('process');
const xml2js = require('xml2js');
const credentialParser = require('../utils').parseCredential

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
        if (error) {console.log(error)}
        res.set("Content-Type", "application/json")
        res.send(JSON.stringify(credentialParser(data)))
    })
})

router.post('/convert', (req, res, next) => {
    res.send("Not yet implemented")
})

module.exports = router;