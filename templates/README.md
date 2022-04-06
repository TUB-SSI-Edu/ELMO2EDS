# Templates
These are the currently implemented conversion templates. 
Each document type (transcript of records, abitur, etc) requires it's own template file. 
## Special Templates
Filenames prefixed wit a underscore imply a special template file. 
[`_baseCredential.js`](/templates/_baseTemplate.js) is a basis for other and possibly future templates. Other templates in this project inherit the basics from this.
If you want to change core elements of all templates you can edit this file.

The [`_plainCredential.js`](/templates/_plainTemplate.js) is the conversion that is not tailored for a specific usecase but tries to convert all files in ELMO/EMREX format as broad as possible.  To achive this readablility and flatness of the resulting JSON file my suffer, as it tried to convert every nested LaerningOpportunitySpecification into an euqivalent EBSI object.