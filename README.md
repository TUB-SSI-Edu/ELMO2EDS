# elmo-converter

The goal of this project is to convert a XML file of a german upper secondary school diploma (_"Zeugnis der Allgemeinen Hochschulreife"_ / _Abitur_) into a [JSON-LD](https://json-ld.org/) [verifiable educational credential](https://w3c-ccg.github.io/vc-ed-models/#approaches) that can be issued via e.g. [AcaPy](https://github.com/hyperledger/aries-cloudagent-python/blob/main/demo/AriesOpenAPIDemo.md).

Something similar has been achieved by the [ovrhd.nl](https://ovrhd.nl) group with an API that can be found at https://duo.ovrhd.nl/api/elmo/sovrhd but this approach is not quite sofisticated enough for our needs.

<details>
<summary>example api call</summary>

```sh
curl -d "example_elmo_emrex.xml" -H "Content-Type:text/plain;charset=utf-8" -X POST https://duo.ovrhd.nl/api/elmo/sovrhd
```

example response:

```json
[
   {
     "issuer": "did:dock:5D7Zy8Xh7s4SL61T6c5UoyzBFubNFq4ED4tQGsCJRR7ostxs",
     "@context": [
       "https://www.w3.org/2018/credentials/v1"
     ],
     "type": [
       "VerifiableCredential"
     ],
     "credentialSchema": {
       "id": "blob:dock:5EXTaPAeXJ4A8cSDEfwmrg9pW6egPnjvpmt2TteCBUu493no",
       "type": "JsonSchemaValidator2018"
     },
     "credentialSubject": {
       "id": "did:duo:1234567890abcd",
       "givenNames": "Mustermann",
       "familyName": "Max",
       "bday": "1999-12-30",
       "BRIN": "E",
       "issuer": "E",
       "reportTitle": "Abitur",
       "EQFLevel": "4",
       "LOSDescription": "higher education entrance qualification",
       "LOSTitle": "Abitur",
       "LOSType": "Degree Programme"
     }
   }
 ]
```
</details>


The overview over the flow of the application can be found [here](#typical-flow-of-programm)
---

## Table of Contents

- [elmo-converter](#elmo-converter)
  - [The overview over the flow of the application can be found here](#the-overview-over-the-flow-of-the-application-can-be-found-here)
  - [Table of Contents](#table-of-contents)
    - [First Progress using Golang and switch to NodeJS](#first-progress-using-golang-and-switch-to-nodejs)
    - [Building and Execution](#building-and-execution)
      - [Prerequisites](#prerequisites)
      - [Building](#building)
      - [Running](#running)
    - [Switch from Golang to NodeJS](#switch-from-golang-to-nodejs)
    - [Prerequisites](#prerequisites-1)
    - [Building and Running](#building-and-running)
  - [API (wip)](#api-wip)
  - [Additional details](#additional-details)
    - [Input file](#input-file)
    - [Output file](#output-file)
    - [Custom templates](#custom-templates)
      - [Keywords (required)](#keywords-required)
      - [Extras (optional)](#extras-optional)
    - [Testing](#testing)
    - [Typical flow of data](#typical-flow-of-data)
    - [Deployment](#deployment)
  - [Known problems](#known-problems)
    - [optional quality of life features](#optional-quality-of-life-features)



---

### First Progress using Golang and switch to NodeJS 

<details>

<summary>earlier golang documentation</summary>

### Building and Execution

#### Prerequisites
- golang 1.17 ([install](https://golang.org/doc/install))
- xml file in the [emrex/emlo format](https://github.com/emrex-eu/elmo-schemas)

Clone project

#### Building

```sh
git clone https://git.snet.tu-berlin.de/blockchain/idunion/elmo-converter.git
```
Download dependencies
```
cd elmo-converter/src
go mod download 
```

build project to output directory
```
go build -o ../bin/
```

If you only want to test the converter use `go run ./elmo-converter` and all build files will be temporary. See below for running commands. <br>
You can also use ``go install ./elmo-converter`` to build and store the executables in your go directory 
and be able to access them systemwide

#### Running

Navigate to the directory where you build your executables to and make sure your elmo xml file is stored in the same direectory.
````
./elmo-converter <path_to_xml_file>
````
</details>

### Switch from Golang to NodeJS
Golang is a statically typed language. Creating dynamic data types depending on the input is not trivial. 
That's why the output formats have to be precisely defined. That leads to a lot of clutter and a less readable and usable parsing result. Here an example with identifiers:

<details>
<summary>example</summary>
In Go we needed to have a list of identifiers to collect all potentially given formats of indetifiers and each would be an object with type and value

```json
learner:{
  identifiers:[
    identifier:{
      type: "ISCD",
      value: "12345678"
    },
    identifier:{
      type: "Matrikelnummer",
      value: "987654"
    },
    identifier:{
      type: "Student-ID",
      value: "456789"
    },
  ]
}

```

wich idealy would be formated like this:
```json
learner:{
  identifierISCD : "12345678",
  identifierMatrNr : "987654",
  identifierStId: "456789"
}
```
or 
```json
learner:{
  identifiers:[
    ISCD : "12345678",
    MatrNr : "987654",
    StudentId: "456789"
  ]
}
```

Further would any field, that is expected but not found filled with a null value wich results in even more clutter.
An example can be found in the `credential.js`
</details>

--- 

### Prerequisites
- developed with NodeJS v16 ([install](https://nodejs.org))
- xml file in the [emrex/emlo format](https://github.com/emrex-eu/elmo-schemas)

### Building and Running

Clone project:
```sh
git clone https://git.snet.tu-berlin.de/blockchain/idunion/elmo-converter.git
```
Download dependencies
```sh
npm install
```

run `main.js`
```sh
node main.js
```

This will start the server on http://localhost:8081/.

Test with:

```sh
curl -d @test.xml -H "Content-Type: application/xml" http://localhost:8081/api/xml/convert/
```

## API (wip)
The service comes with a REST-API with a following routes all reachable under `/api/`:

| Route         | Method      | description |
| :---         | :---:    | ---:          |
| `/api/xml/convert/<filename>`      | GET | returns the raw XML-to-JS object parsed from the `<filename>.xml` in the root directory of the service as `JSON` - _usefull for debugging purposes_ |
| `/api/xml/convert/`      | POST | returns the pure XML-to-JSON parsed from the XML file send via POST |
| `/api/xml/convert/verifiableCredential`       | POST  | send XML via POST and recieve converted JSON|
| `/api/json/...`       |   | reverse operation from above - _not yet impolemented_|


## Additional details
### Input file

The converter should be given an XML file attached to PDF files issued by 
the [Bundesdruckerei](https://www.bundesdruckerei.de/) containing  educational achievements in the [elmo/emrex standard](https://github.com/emrex-eu/elmo-schemas).

The type of the document is determined by the Value at XPath `elmo > report > learningOpportunitySpecification > title` with the attribute `xml:lang="en"`. 
Currently supported type are:

- Abitur
- Transcript of Records

If no value is given a more general json file is created wich is probably less suitable for credential creation.

### Output file
The convert should output a [JSON-LD](https://json-ld.org/) wich can be issued as a verifiable credential in an SSI context of the hyperledger aries network.

A first example outline can be found [here](./complementary_files/example_abi.json).

### Custom templates

You can add your own conversion template. Take a look at `templates/_blank.js` for a blank example.

Required components are\\
- keywords (`array`)
- Issuer (`class`)
- CredentiaslSubject (`class`)
- handleAchievements (`function`)


#### Keywords (required)

The document is search for these Keywords and if a match is found your template is used.
Use this to determine on wich kinds of documents your template should be applied.

#### Extras (optional)

You can extract additional information from the given file wich isnt categorized by the default classes.
You get the raw JavaScript object converted from the xml file and should return an Object that has alle the parsed additional information you need in xyour credential. The Properties are copied onto the final credential response.

### Testing

Testing is done with [jest](https://jestjs.io/) wich supplies easy and straight forward testing and coverage functionalities. Additional tests can be written in the `node-version/tests` directory as `filename.test.js`.

All tests can be executed by running `npm test` in the `node-version` directory.

### Typical flow of data
The XML file that is in the body of the http request is automaticly converted into a JS object with [xml2js](https://www.npmjs.com/package/xml2js) in [routes/fromXML.js](../routes/fromXML.js) and passed into the formating function : `credentalParser()`.

[Here](/utils/credentialParser.js)
the object we look for features of the EMLO data tha would allow a classification for example certain keywords like "transcript of records".
If a fitting tempalte is found it can be applied, if not, the plain conversion takes place.

In the templates we map parts of the data we need to other keywords of our new credential and conctruct our resulting js object.

In the response, this object is than converted to JSON and send together with a status code.

### Deployment
The converter is hosted on a server of TU Berlin at `130.149.223.146` on port `8081`.
Features are developed on the `dev` branch and automaticly tested on pushing.

When the dev branch is merged into `main`, a github action automaticly remotes into the server and pulls the new commits. A process manager locally restarts the converter if files change.

## Known problems

Not all data required for a verifiable credential exists in the input file. This data has to be collected to successfully convert to that specific format.

### optional quality of life features
- [ ] read xlm directly from pdf document
- [x] enclose converter into a websevice with REST API
- [ ] implement reverse conversion jsonld -> xml

