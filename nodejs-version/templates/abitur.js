const utils = require('../utils')

class Issuer {
    constructor(issuer, levels){
            this.url = issuer.url,
            this.country = issuer.country

            utils.parseLangText("title", issuer, this)
            utils.parseLangText("description", issuer, this)
            // issuer id
            for (const id of utils.assertArray(issuer.identifier)) {
                this["id"+id.$.type.toUpperCase()] = id._
            }
            // levels
            for (const level of utils.assertArray(levels)) {
                this["level"+level.type.toUpperCase()] = level.value
            }
    }
}

class CredentialSubject {
    constructor(learner){
        this.givenName = learner.givenNames,
        this.familyName =learner.familyName
        this.degree = {}
    }

    addDegree(LOS, credits) {
        utils.parseLangText("title", LOS, this.degree)
        utils.parseLangText("description", LOS, this.degree)
        for (const credit of utils.assertArray(credits)) {
            this.degree["score"+credit.scheme.toUpperCase()] = credit.value
        }
    }   
}

class Module {
    constructor(moduleLOS){
        this.courseSubject = moduleLOS.title._
        this.semesterScores = this.parseSemesters(moduleLOS.hasPart)
    }
    parseSemesters(semesters){
        let res = {}
        let semCounter = 1
        for (const semester of utils.assertArray(semesters)) {
            res["semester"+semCounter] = semester.learningOpportunitySpecification.specifies.learningOpportunityInstance.credit.value
            semCounter++
        }
        return res
    }
}

class ForeignLanguage {
    constructor(languageLOS){
        this.courseSubject = languageLOS.title._
        this.level = languageLOS.specifies.learningOpportunityInstance.resultLabel
    }
}

class Examination {
    constructor(examLOS){
        this.courseSubject = examLOS.title._
    }
}


module.exports = {Issuer, CredentialSubject, Module, ForeignLanguage, Examination}