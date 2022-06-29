# ELMO2EDS
ELMO2EDS is open-source software accessible via an API to convert data.
The converter supports the conversion of upper secondary school
certificates and transcript of records from ELMO to EDS. 

In the first step of the conversion, a request is sent to ELMO2EDS to convert an ELMO file to EDS. The request
triggers the converter to check whether the requested document is an upper secondary school certificate or transcript of records. The differentiated consideration is required as EDS structure differs for
each type of learning achievement. Depending on the type of ELMO, a template is automatically selected to map claims, external standards, and the structure of ELMO and EDS. Lastly, ELMO2EDS adds placeholders for issuers' and holders' signatures and returns JSON-LD data format. 

An overview of the flow of the application can be found [here](#typical-flow-of-programm)
---

## Table of Contents

- [ELMO2EDS](#ELMO2EDS)
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
    - [Typical flow of programm](#typical-flow-of-programm)
  - [Known problems](#known-problems)
    - [optional quality of life features](#optional-quality-of-life-features)

### Prerequisites
- NodeJS v16 ([install](https://nodejs.org))

### Building and Running

Clone project:
```sh
git clone https://git.snet.tu-berlin.de/blockchain/idunion/ELMO2EDS.git
```
Download dependencies
```sh
npm install
```

Following will start the server on http://localhost:8081/.

run `main.js`
```sh
node main.js
```
Test with:

```sh
curl -d @./__tests__/elmoCredentials/Baschenborn_Thor.xml -H "Content-Type: application/xml" http://130.149.223.146:8081/api/xml/convert/verifiableCredential
```

## API
The service comes with a REST API with a following routes, all reachable under `/API/`:

| Route         | Method      | description |
| :---         | :---:    | ---:          |
| `/api/xml/convert/<filename>`      | GET | returns the raw XML-to-JS object parsed from the `<filename>.xml` in the root directory of the service as `JSON` - _usefull for debugging purposes_ |
| `/api/xml/convert/`      | POST | returns the pure XML-to-JSON parsed from the XML file send via POST |
| `/api/xml/convert/verifiableCredential`       | POST  | send XML via POST and recieve converted JSON|
| `/api/json/...`       |   | reverse operation from above - _not yet impolemented_|

## Additional details
### Input file

The type of the document is determined by the Value at XPath `elmo > report > learningOpportunitySpecification > title` with the attribute `xml:lang="en"`. 
Currently, supported types are:

- Upper secondary school certificate
- Transcript of Records

If no value is given, a more general JSON file is created, probably less suitable for credential creation.

### Output file
The output is a [JSON-LD](https://json-ld.org/) formatted file, which can be issued as a verifiable credential in an SSI context.

An example output file can be found in `./complementaryFiles/ebsi_cred_example.json`.

### Custom templates

Custom templates can be added to support more ELMO DCs types.

A blank template can be found in `templates/_blank.js`.

Required components for custom templates are
- keywords (`array`)
- Issuer (`class`)
- CredentiaslSubject (`class`)
- handleAchievements (`function`)

#### Keywords (required)

Templates of ELMO2EDS are searched by these Keywords, and if a match is found the a corresponding template is used for conversion.

### Testing

For testing, jest is used (https://jestjs.io/). It supplies testing and coverage functionalities for NodeJS. Tests are located in the `node-version/tests` directory as `filename.test.js`.

Tests can be executed by running `npm test` in the `node-version` directory.

### Typical flow of programming
The XML file that is in the body of the http request is automaticly converted into a JS object with [xml2js](https://www.npmjs.com/package/xml2js) in `./routes/fromXML.js` and passed into the formating function : `credentalParser()`.

Classification of ELMO DCs type is based on keywords, such as "transcript of records". `./utils/credentialParser.js`

## Known problems

Not all data required for a verifiable credential exists in the input file. This data has to be collected to successfully convert to that specific format.

### optional quality of life features
- [x] enclose converter into a websevice with REST API
- [ ] read xlm directly from pdf document
- [ ] implement reverse conversion jsonld -> xml

