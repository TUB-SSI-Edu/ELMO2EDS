
// path to mockCredential - later maybe dynmaicly created
const mockCredentialPath = "./mockCredential.json";

// defines properties that are required to validate a template. 
// If these are not found in a template, a warning is given.
// reqired property : test function
const requiredTemplateProperties = {
  keywords: (obj) => {
    return Array.isArray(obj) == true;
  },
  Issuer: (obj) => typeof obj == "function",
  CredentialSubject: (obj) => typeof obj == "function",
  handleAchievements: (obj) => typeof obj == "function",
};

// on startup look for templates
const templateDict = loadTemplates();

// validadtes tempalte - checks if all required properties and funciton are present
function validateTemplate(filename, requirements) {
  const template = require("../templates/" + filename);
  for (const [prop, test] of Object.entries(requirements)) {
    // if prop not existing or if it fails the test
    if (template[prop] == undefined || !test(template[prop])) {
      console.warn("TEMPLATE NOT VALID! :", filename);
      return false;
    }
  }
  return true;
}

// gather keywords from all templates in directory and validate them
function loadTemplates() {
  let templateDict = {};
  const normalizedPath = require("path").join(__dirname, "../templates");

  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    // file is skipped if not validated or name starts with underscore
    if (file[0] == "_" || file[0] == "R" || !validateTemplate(file, requiredTemplateProperties)) {
      return
    }
    // else collect keywords
    console.log("found template:", file)
    require("../templates/" + file).keywords.forEach((keyw) => {
      templateDict[keyw.toLowerCase()] = file
    });
  })
  return templateDict;
  }

// check if any of the collected keyword is present in certain areas of the document
// return array of the template filenames that could be applied based on found keywords
function getDocTypes(potentialTypeTags) {
  return potentialTypeTags.reduce((found, el) => {
    if (el) el = el.toLowerCase();
    // if key is known and not already in list -> add it
    return el in templateDict && !found.includes(templateDict[el]) ? found.concat([templateDict[el]])
      : found;
  }, []);
}


// maybe use xPath query for XML package instead of hardcoding every path
// |--------------------|
// | main parsing logic |
// |--------------------|
function parseCredential(xml, mode = "AUTO") {
  // for shorter access to key properties in code
  const elmo = xml.elmo;
  const LOS = elmo.report.learningOpportunitySpecification;
  const LOI = LOS.specifies.learningOpportunityInstance;
  // load mock credential to add data to
  let cred = require(mockCredentialPath);
  let template;

  //  if mode not PLAIN look for tempalte types
  if (mode == "AUTO") {
    // places to check for keywords
    let potentialTypeTags = [
      LOS.title?._,
      LOI?.credit?.level,
      elmo?.attachment?.title,
    ];

    // check if it is a "known document"
    const docTypes = getDocTypes(potentialTypeTags);
    console.log("potential templates:", docTypes, "; using first entry");
    // if fitting tempaltes found, use first (arbitrary)
    template =
      docTypes.length > 0 ? require("../templates/" + docTypes[0]) : undefined;

    if (docTypes.length == 0) {
      mode = "PLAIN";
      console.log("no fitting template found - defaulting to plain mode");
    }
  }
  // if no template found, use plain conversion
  template ||= require("../templates/_plainConversion.js");

  // fetch parsing function depending on conversion mode
  let converterDetails = converterMode(mode);

  // data that gets parsed, regardless of wich template is used
  // ISSUER
  let issuerData = new template.Issuer(elmo.report.issuer, LOI.level);
  cred.issuer = Object.assign(cred.issuer, issuerData);

  // date
  cred.diplomaIssuanceDate = elmo.report.issueDate;
  cred.diplomaGeneratedDate = elmo.generatedDate;

  // CREDENTIAL SUBJECT
  let subjectData = new template.CredentialSubject(elmo.learner);
  subjectData.addDegree(LOS, LOI.credit);
  cred.credentialSubject = Object.assign(cred.credentialSubject, subjectData);

  // parse details
  cred = converterDetails(elmo, cred, template)

  console.log(cred);
  // return finished credentail to be send of
  return cred;
}

// returns function that parses details depending on conversion mode
function converterMode(mode) {
  switch (mode) {
    case "AUTO":
      return function(elmo, cred, template){

        const LOS = elmo.report.learningOpportunitySpecification;

        // ACHIEVEMENTS
        cred.credentialSubject.achieved[0].hasPart.learningAchievements =
          template.handleAchievements(LOS.hasPart);

        // EXTRAS IF NEEDED
        if (template.hasOwnProperty("handleExtras")) {
          extras = template.handleExtras(elmo);
          Object.assign(cred, extras);
        }

        return cred
      }
    // PLAIN and DEFAULT 
    default:
      return function(elmo, cred, template){
        let root = template.handleAchievements(elmo)
        cred.credentialSubject.achieved.push(...root)
        return cred
      } 
  }
}

module.exports = {
  parseCredential,
  _testing: {
    templateDict,
    getDocTypes,
    validateTemplate,
  },
};
