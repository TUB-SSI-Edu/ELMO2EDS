

// maybe use xPath query for XML package instead of hardcoding every path
function parseCredential(xml){
    const elmo = xml.elmo
    const LOS = elmo.report.learningOpportunitySpecification
    const LOI = LOS.specifies.learningOpportunityInstance
    let cred = require("./baseCredential.json")

    const docType = LOS.title._
    const template = require('../templates/'+docType.toLowerCase())
    console.log("using template", docType.toLowerCase()+".js")
    // ISSUER
    let issuerData = new template.Issuer(elmo.report.issuer, LOI.level)
    cred.issuer = Object.assign(cred.issuer, issuerData)

    // date 
    cred.issuanceDate = elmo.issueDate
    cred.generatedDate = elmo.generatedDate

    // CREDENTIAL SUBJECT
    let subjectData = new template.CredentialSubject(elmo.learner)
    subjectData.addDegree(LOS, LOI.credit)
    cred.credentialSubject = Object.assign(cred.credentialSubject, subjectData)

    // ACHIEVEMENTS
    cred.achievements = []
    cred.achievements.push(template.handleAchievements(LOS.hasPart))

    console.log(cred)
    return cred
}

module.exports = parseCredential