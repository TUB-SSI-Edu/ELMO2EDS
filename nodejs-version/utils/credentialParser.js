

// maybe use xPath query for XML package instead of hardcoding every path
function parseCredential(xml){
    console.log(xml)
    const elmo = xml.elmo
    const LOS = elmo.report.learningOpportunitySpecification
    const LOI = LOS.specifies.learningOpportunityInstance
    let cred = require("./baseCredential.json")

    const docType = elmo.report.learningOpportunitySpecification.title._
    const template = require('../templates/'+docType.toLowerCase())
    console.log(template)
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
    // TODO: maybe make achievements more modular for other credential types
    let qPhaseSpec = LOS.hasPart[0].learningOpportunitySpecification
    let learningAchievements = qPhaseSpec.hasPart.map(element => new template.Module(element.learningOpportunitySpecification));
    const qPhaseScore = qPhaseSpec.specifies.learningOpportunityInstance.credit.value
    const qPhase = {
        totalScore: qPhaseScore,
        courses: learningAchievements
    }
    cred.achievements.push({qualificationPhase : qPhase})


    let examsSpec = LOS.hasPart[1].learningOpportunitySpecification
    let examsParts = examsSpec.hasPart.map(element => new template.Examination(element.learningOpportunitySpecification));
    const examsScore = examsSpec.specifies.learningOpportunityInstance.credit.value
    const exams = {
        totalScore: examsScore,
        examns: examsParts
    }
    cred.achievements.push({finalExaminations : exams})

    let foreignLangSpec = LOS.hasPart[2].learningOpportunitySpecification
    const foreignLang = foreignLangSpec.hasPart.map(element => new template.ForeignLanguage(element.learningOpportunitySpecification));
    cred.achievements.push({foreignLanguages : foreignLang})


    console.log(cred)
    return cred
}

module.exports = parseCredential