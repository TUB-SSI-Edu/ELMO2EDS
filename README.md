# elmo-converter

The goal of this project is to convert a XML file of a german secondary education diploma (_"Zeugnis der Allgemeinen Hochschulreife"_ / _Abitur_) into a [JSON-LD](https://json-ld.org/) [verifiable educational credential](https://w3c-ccg.github.io/vc-ed-models/#approaches) that can be issued via e.g. [AcaPy](https://github.com/hyperledger/aries-cloudagent-python/blob/main/demo/AriesOpenAPIDemo.md).

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
- developed with NodeJS v12.21.0 ([install](https://nodejs.org))
- xml file in the [emrex/emlo format](https://github.com/emrex-eu/elmo-schemas)

### Building and Running

Clone project:
```sh
git clone https://git.snet.tu-berlin.de/blockchain/idunion/elmo-converter.git
```
Download dependencies
```sh
cd elmo-converter/node-version
npm install
```

run `main.js`
````
node main.js
````

This will start the server on localhost on port 8081.

## API (wip)
The service comes with a REST-API with a following routes all reachable under `/api/`:

| Route         | Method      | description |
| :---         | :---:    | ---:          |
| `/api/print/<filename>`      | GET | returns the raw XML-to-JS object parsed from the `<filename>.xml` in the root directory of the service as `JSON` - _usefull for debugging purposes_ |
| `/api/convert/<filename>`       | GET  | returns the the parsing attempt of the `<filename>.xml` in the root directory of the service or any occuring errors|
| `/api/convert`       | POST  | send XML via POST and recieve converted JSON - _not yet implemented_|


## Additional details
### Input file

The converter should be given an XML file attached to PDF files issued by 
the [Bundesdruckerei](https://www.bundesdruckerei.de/) containing  educational achievements in the [elmo/emrex standard](https://github.com/emrex-eu/elmo-schemas).

The type of the document is determined by the Value at XPath `elmo > report > learningOpportunitySpecification > title` with the attribute `xml:lang="en"`. 
Currently supported type are:

- Abitur

If no value is given a more general json file is created wich is probably less suitable for credential creation.

### Output file
The convert should output a [JSON-LD](https://json-ld.org/) wich can be issued as a verifiable credential in an SSI context of the hyperledger aries network.

A first example outline can be found [here](https://github.com/pherbke/schoolDiploma).

## Problems
Not all data required for a verifiable credential exists in the input file. This data has to be collected to successfully convert.



### optional quality of life features
- [ ] read xlm directly from pdf document
- [x] enclose converter into a websevice with REST API

