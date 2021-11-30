
// on starup
// gather keywords from all templates
const normalizedPath = require("path").join(__dirname, "../templates");

const templateDict = {}

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  if (file[0] == "_") {
    return
  }
  console.log("found tempalte:", file)
  require("../templates/" + file).keywords.forEach((keyw) => {
    templateDict[keyw.toLowerCase()] = file
  });
  
});

function getDocTypes(potentialTypeTags){
    return potentialTypeTags.reduce((found, el)=>{
        el &&= el.toLowerCase()
        return el in templateDict ? found.concat([templateDict[el]]) : found
    }, [])
}

// maybe use xPath query for XML package instead of hardcoding every path
function parseCredential(xml){
    const elmo = xml.elmo
    const LOS = elmo.report.learningOpportunitySpecification
    const LOI = LOS.specifies.learningOpportunityInstance
    let cred = require("./baseCredential.json")

    // places to check for keywords
    const potentialTypeTags = [LOS.title?._, LOI?.credit?.level]

    // check if it is a "known document"
    const docTypes = getDocTypes(potentialTypeTags)
    console.log("potential templates:", docTypes, "; using first entry")
    const template = require('../templates/'+docTypes[0])

    // ISSUER
    let issuerData = new template.Issuer(elmo.report.issuer, LOI.level)
    cred.issuer = Object.assign(cred.issuer, issuerData)

    // date 
    cred.diplomaIssuanceDate = elmo.report.issueDate
    cred.diplomaGeneratedDate = elmo.generatedDate

    // CREDENTIAL SUBJECT
    let subjectData = new template.CredentialSubject(elmo.learner)
    subjectData.addDegree(LOS, LOI.credit)
    cred.credentialSubject = Object.assign(cred.credentialSubject, subjectData)

    // ACHIEVEMENTS
    cred.achievements = []
    cred.achievements.push(template.handleAchievements(LOS.hasPart))

    // EXTRAS IF NEEDED
    if (template.hasOwnProperty('handleExtras')) {
        extras = template.handleExtras(elmo)
        Object.assign(cred, extras)
    }

    console.log(cred)
    return cred
}

module.exports = parseCredential