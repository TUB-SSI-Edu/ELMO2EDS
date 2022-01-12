const utils = require('../utils/helper')

const keywords = ["abitur"]

class Issuer {
    constructor(issuer, levels){
            this.url = issuer.url;
            this.country = issuer.country;
            utils.multiTagParser("title", "xml:lang", issuer, this);
            utils.multiTagParser("description", "xml:lang", issuer, this);
            // issuer id
            utils.multiTagParser("identifier", "type", issuer, this);
            // levels
            for (const level of utils.assertArray(levels)) {
                this["level"+level.type.toUpperCase()] = level.value
            }
    }
}

class CredentialSubject {
    constructor(learner){
        this.givenName = learner.givenNames
        this.familyName = learner.familyName
        this.fullName = this.givenName +" "+this.familyName
        this.citizenship = learner.citizenship
        this.bday = learner.bday
        this.placeOfBirth = learner.placeOfBirth
        this.gender = learner.gender
        this.achieved = []
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

class Module {
    constructor(moduleLOS){
        utils.multiTagParser("title", "xml:lang", moduleLOS, this)
        this.hasPart = {}
        this.hasPart.semesters = utils.assertArray(moduleLOS.hasPart).map((el) => {
            return new Semester(el)
        })
    
    }
}

class Semester {
    constructor(semester){
        utils.multiTagParser("title", "xml:lang", semester?.learningOpportunitySpecification, this)
        this.start = semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.academicTerm?.start
        this.end = semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.academicTerm?.end
        this.grade = semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.credit?.value
        this.gradingScheme = semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.credit?.scheme
    }
}

class ForeignLanguage {
    constructor(languageLOS){
        utils.multiTagParser("title", "xml:lang",languageLOS, this)
        this.level = languageLOS?.specifies?.learningOpportunityInstance?.resultLabel
    }
}

class Examination {
    constructor(examLOS){
        utils.multiTagParser("title", "xml:lang", examLOS, this)
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
        let title = componentLOS?.title?._
        this.type = title.split(" ")[2]
        this.score = componentLOS?.specifies?.learningOpportunityInstance?.credit?.value
    }
}

function handleAchievements(parts){
    let res = []
    let qPhaseSpec = parts[0].learningOpportunitySpecification
    let learningAchievements = qPhaseSpec.hasPart.map(element => new Module(element.learningOpportunitySpecification));
    const qPhaseScore = qPhaseSpec?.specifies?.learningOpportunityInstance?.credit?.value
    const qPhase = {
        totalScore: qPhaseScore,
        courses: learningAchievements
    }
    res.push({qualificationPhase : qPhase})


    let examsSpec = parts[1].learningOpportunitySpecification
    let examsParts = examsSpec.hasPart.map(element => new Examination(element.learningOpportunitySpecification));
    const examsScore = examsSpec?.specifies?.learningOpportunityInstance?.credit?.value
    const exams = {
        totalScore: examsScore,
        examns: examsParts
    }
    res.push({finalExaminations : exams})

    let foreignLangSpec = parts[2].learningOpportunitySpecification
    const foreignLang = foreignLangSpec.hasPart.map(element => new ForeignLanguage(element.learningOpportunitySpecification));
    res.push({foreignLanguages : foreignLang})
    return res
}


module.exports = {Issuer, CredentialSubject, handleAchievements, keywords}