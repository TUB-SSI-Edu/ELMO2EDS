// path: api/fromXML
const express = require('express')
const utils = require('../utils/helper')
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
const pathToLocalFiles = "../complementary_files/"

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
    if (utils.isEmpty(req.body)){
        res.send("no file recieved - please post valid xml file")
    } else {
        next()
    }
})


router.post('/convert/', (req, res, next) => {
    res.send(JSON.stringify(req.body , null, 4))
})


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

router.post('/convert/verifiableCredential', (req, res, next) => {
    if(!req.body.hasOwnProperty('elmo')){
        res.statusCode(400).send("Could not process your file. Please make sure it  is in a valid elmo/emrex format.")
    }
    let cred = credentialParser(req.body)
    res.send(JSON.stringify(cred, null, 4))
})

// reads local file :filename and uses that as input
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


// convertsion with XPath - to replace the current parsing when done

module.exports = router;