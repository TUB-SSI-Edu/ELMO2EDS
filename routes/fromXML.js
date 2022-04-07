// path: api/fromXML
const express = require('express')
const utils = require('../utils/helper')
const router = express.Router()

const xmlparser = require('express-xml-bodyparser');
const fs = require('fs');
const xml2js = require('xml2js');
const credentialParser = require('../utils/credentialParser') .parseCredential

const parseOptions = {
    explicitArray: false,
    trim: true
}

// parse XML in body to js object
const XMLParser = new xml2js.Parser(parseOptions);

const pathToLocalFiles = "./complementaryFiles/"

// if not accessed via api
router.get('/', (req, res, next) => {
    res.send("please post xml file to /api/convert")
})



// parse and check if empty
router.post("/*", xmlparser({
    trim: false, 
    normalize: false,
    normalizeTags: false, 
    explicitArray: false
    }),(req,res,next) => {
        console.log(req.body)
    if (utils.isEmpty(req.body)){
        res.status(400).send("no file recieved - please post valid xml file")
    } else {
        next()
    }
})

// just the raw conversion to JS-> JSON no formatting applied
router.post('/convert/', (req, res, next) => {
    res.send(JSON.stringify(req.body , null, 4))
})

// same as above but with local file
router.get('/convert/:fileName', (req, res, next) => {
    let text = fs.readFileSync(pathToLocalFiles + req.params.fileName + ".xml", "utf-8") 

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

// converts and applies formatting. This is the main usecase
router.post('/convert/verifiableCredential', (req, res, next) => {
    if(!req.body.hasOwnProperty('elmo')){
        res.status(400).send("Could not process your file. Please make sure it  is in a valid elmo/emrex format and the http header for 'Content-Type' is set to 'application/xml'.")
    }
    let cred = credentialParser(req.body)
    res.send(JSON.stringify(cred, null, 4))
})

// same as above but with local file instead of using file in request body
router.get("/convert/verifiableCredential/:fileName", (req, res, next) => {
    let text = fs.readFileSync(pathToLocalFiles + req.params.fileName + ".xml", "utf-8") 

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


module.exports = router;