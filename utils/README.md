# Utils
This directory contains useful helper function and utilities for the converting process.
The main logic that is called from the Node route happens in [`credentialParser.js`](/credentialParser.js).

[helper.js](/utils/helper.js)
contains some function to format or parse specific data structures, assure array data types or check for empty objects.

[mockCredential.js](/utils/mockCredential.js) adds placeholder infromation of a verifiable credential that in a real application would be supllied before the conversion and contains details about the `dids` of the participants, the `proof` of the credential or the context of the JSON-LD schema.

In [credentialParser.js](/utils/credentialParser.js)
the object we look for features of the EMLO data tha would allow a classification for example certain keywords like "transcript of records".
If a fitting tempalte is found it can be applied, if not, the plain conversion takes place.
