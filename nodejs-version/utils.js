

// maybe use xPath query for XML package instead of hardcoding every path

// Abitur classes - to be exported as swappable template




function parseCredential(xml){
    const elmo = xml.elmo
    const LOS = elmo.report.learningOpportunitySpecification
    const LOI = LOS.specifies.learningOpportunityInstance
    cred = {}

    const docType = elmo.report.learningOpportunitySpecification.title._
    const template = require('./templates/'+docType.toLowerCase())
    console.log(template)
    // ISSUER
    cred.issuer = new template.Issuer(elmo.report.issuer, LOI.level)

    // date
    cred.issuanceDate = elmo.generatedDate

    // CREDENTIAL SUBJECT
    cred.credentialSubject = new template.CredentialSubject(elmo.learner)
    cred.credentialSubject.addDegree(LOS, LOI.credit)

    // ACHIEVEMENTS
    cred.achievements = []
    // TODO: maybe make achievements more modular
    let qPhase = LOS.hasPart[0].learningOpportunitySpecification
    let learningAchievements = qPhase.hasPart.map(element => new template.Module(element.learningOpportunitySpecification));
    cred.achievements.push({learningAchievements : learningAchievements})


    let exams = LOS.hasPart[1].learningOpportunitySpecification
    exams = exams.hasPart.map(element => new template.Examination(element.learningOpportunitySpecification));
    cred.achievements.push({finalExaminations : exams})

    let foreignLang = LOS.hasPart[2].learningOpportunitySpecification
    foreignLang = foreignLang.hasPart.map(element => new template.ForeignLanguage(element.learningOpportunitySpecification));
    cred.achievements.push({foreignLanguages : foreignLang})


    console.log(cred)
    return cred
}

// if not iterable do only to single objetc; if iterable to every item
function assertArray(obj){
    if (obj instanceof Array){
        return obj;
    }
    return [obj]
}

function parseLangText(type, xml, target){
    if (typeof xml[type] == "undefined"){return}
    for (const instance of assertArray(xml[type])) {
        target[type+instance.$["xml:lang"].toUpperCase()] = instance._
    }
}


module.exports = {parseCredential, parseLangText, assertArray}