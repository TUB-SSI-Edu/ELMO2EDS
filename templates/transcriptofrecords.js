
// some usefull helper function you might want to use
const utils = require('../utils/helper')
const base = require('./_baseTemplate')

const keywords = ["transcript of records", "bachelor", "master"]

class Issuer extends base.IssuerStub{
    constructor(issuer, levels){
        super(issuer, levels)
    }
}

class CredentialSubject extends base.CredentialSubjectStub{
    constructor(learner){
        super(learner)
    }

    addDegree(learnerLOS, credits) {
        this.achieved.push(new Degree(learnerLOS, credits))
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
        this.hasPart = {
            'learningAchievements': []
        }
    }
}

// further you need all the classes to handle your achievements 
// and a function that constructs them

function handleAchievements(parts){
    return parts.map(el => new Module(el.learningOpportunitySpecification))
}

// TODO: your achievement classes
class Module {
    constructor(moduleLOS){
        utils.multiTagParser("title", "xml:lang", moduleLOS, this)
        this.identifier = utils.parseIdentifier(moduleLOS)
        this.wasDerivedFrom = [{
            grade: moduleLOS?.specifies?.learningOpportunityInstance?.resultLabel,
            status : moduleLOS?.specifies?.learningOpportunityInstance?.status,
            specifiedBy : {
                gradingScheme:{
                    title: moduleLOS?.specifies?.learningOpportunityInstance?.gradingSchemeLocalId
                }
            }
        }]
        this.specifiedBy = [{
            learningOpportunityType: moduleLOS.type,
            eCTSCreditPoints : moduleLOS?.specifies?.learningOpportunityInstance?.credit?.value
        }]       
    }
}

function handleExtras(elmo){
    extras = {}
    // handle gradingSchemes
    let gSchemes = []
    console.log(elmo.report.gradingScheme)
    gSchemes = utils.assertArray(elmo.report.gradingScheme).map(el => new GradingScheme(el))
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

