
// some usefull helper function you might want to use
const utils = require('../utils/helper')

const keywords = ["transcript of records", "bachelor", "master"]

class Issuer {
    constructor(issuer, levels){
        this.url = issuer.url,
        this.country = issuer.country

        utils.multiTagParser("title", "xml:lang", issuer, this)
        utils.multiTagParser("description", "xml:lang", issuer, this)
        utils.multiTagParser("identifier", "type", issuer, this)

        // levels
        for (const level of utils.assertArray(levels)) {
            this["level"+level.type.toUpperCase()] = level.value
        }
    }
}

class CredentialSubject {
    constructor(learner){
        this.givenName = learner.givenNames,
        this.familyName = learner.familyName,
        this.citizenship = learner.citizenship,
        this.bday = learner.bday,
        this.placeOfBirth = learner.placeOfBirth,
        this.gender = learner.gender,
        utils.multiTagParser("identifier", "type", learner, this),
        this.degree = {}
    }

    addDegree(learnerLOS, credits) {
        this.degree = new Degree(learnerLOS, credits)
    }   
}

class Degree {
    constructor(learnerLOS, credits){
        utils.multiTagParser("title", "xml:lang", learnerLOS, this)
        utils.multiTagParser("description", "xml:lang", learnerLOS, this)
        for (const credit of utils.assertArray(credits)) {
            this["score"+credit.scheme.toUpperCase()] = credit.value
            this["level"+credit.scheme.toUpperCase()] = credit.level
        }
    }
}

// further you need all the classes to handle your achievements 
// and a function that constructs them

function handleAchievements(parts){
    return {'courses': parts.map(el => new Module(el.learningOpportunitySpecification))}
}

// TODO: your achievement classes
class Module {
    constructor(moduleLOS){
        utils.multiTagParser("identifier", "type", moduleLOS, this)
        utils.multiTagParser("title", "xml:lang", moduleLOS, this)
        this.type = moduleLOS.type
        this.status = moduleLOS?.specifies?.learningOpportunityInstance?.status
        this.gradingSchemeLocalId = moduleLOS?.specifies?.learningOpportunityInstance?.gradingSchemeLocalId
        this.resultLabel = moduleLOS?.specifies?.learningOpportunityInstance?.resultLabel
        let credits = moduleLOS?.specifies?.learningOpportunityInstance?.credit
        for (const credit of utils.assertArray(credits)) {
            this["score"+credit.scheme.toUpperCase()] = credit.value
        }
    }
}

function handleExtras(elmo){
    extras = {}
    // handle gradingSchemes
    let gSchemes = []
    console.log(elmo.report.gradingScheme)
    gSchemes = utils.assertArray(elmo.report.gradingScheme).map(el => new GradingScheme(el))
    console.log(gSchemes)
    extras.gradingSchemes = gSchemes

    // attachments?
    
    return extras
}
// extra classes
class GradingScheme {
    constructor(schema){
        this.title = schema?.$?.localId
        utils.multiTagParser("description", "xml:lang", schema, this)
    }
}

module.exports = {Issuer, CredentialSubject, handleAchievements, handleExtras, keywords}

