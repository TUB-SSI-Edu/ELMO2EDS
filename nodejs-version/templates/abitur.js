const utils = require('../utils/helper')

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
        this.familyName = learner.familyName
        this.degree = {}
    }

    addDegree(learnerLOS, credits) {
        this.degree = new Degree(learnerLOS, credits)
    }   
}

class Degree {
    constructor(learnerLOS, credits){
        utils.parseLangText("title", learnerLOS, this)
        utils.parseLangText("description", learnerLOS, this)
        for (const credit of utils.assertArray(credits)) {
            this["score"+credit.scheme.toUpperCase()] = credit.value
        }
    }
}

class Module {
    constructor(moduleLOS){
        console.debug("module:\n",moduleLOS)
        this.courseSubject = moduleLOS.title._
        this.semesterScores = this.parseSemesters(moduleLOS.hasPart)
    }
    parseSemesters(semesters){
        let res = {}
        let semCounter = 1
        for (const semester of utils.assertArray(semesters)) {
            console.debug("sem:\n",JSON.stringify(semester))
            const credit = utils.getKey('learningOpportunitySpecification.specifies.learningOpportunityInstance.credit.value', semester)
            const label = utils.getKey('learningOpportunitySpecification.specifies.learningOpportunityInstance.resultLabel', semester)
            res["semester"+semCounter] = credit ?? label
            semCounter++
        }
        return res
    }
}

class ForeignLanguage {
    constructor(languageLOS){
        utils.parseLangText("title", languageLOS, this)
        this.level = languageLOS.specifies.learningOpportunityInstance.resultLabel
    }
}

class Examination {
    constructor(examLOS){
        utils.parseLangText("title", examLOS, this)
        this.components = this.addComponents(examLOS.hasPart)
    } 
    addComponents(components){
        let res = []
        for (const component of utils.assertArray(components)) {
            res.push(new ExaminationComponent(component.learningOpportunitySpecification))
        }
        return res
    }
}

class ExaminationComponent {
    constructor(componentLOS){
        // dont need title if we have type
        //utils.parseLangText("title", componentLOS, this)
        let title = componentLOS["title"]._
        this.type = title.split(" ")[2]
        this.score = componentLOS.specifies.learningOpportunityInstance.credit.value
    }
}


module.exports = {Issuer, CredentialSubject, Module, ForeignLanguage, Examination}