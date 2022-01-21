const utils = require('../utils/helper')
const base  = require('./_baseTemplate')

const keywords = ["abitur"]

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

class Module {
    constructor(moduleLOS){
        utils.multiTagParser("title", "xml:lang", moduleLOS, this)
        this.identifier = utils.parseIdentifier(moduleLOS)
        this.hasPart = {}
        this.hasPart.semesters = utils.assertArray(moduleLOS.hasPart).map((el) => {
            return new Semester(el)
        })
    
    }
}

class Semester {
    constructor(semester){
        this.identifier = utils.parseIdentifier(semester)
        utils.multiTagParser("title", "xml:lang", semester?.learningOpportunitySpecification, this)
        this.start = semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.academicTerm?.start
        this.end = semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.academicTerm?.end

        this.wasDerivedFrom = [{
            grade: semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.credit?.value,
            specifiedBy : {
                gradingScheme:{
                    title: semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.credit?.scheme
                }
            }
        }]
        this.wasInfluencedBy = [{
            startedAtTime: semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.academicTerm?.start,
            endedAtTime: semester?.learningOpportunitySpecification?.specifies?.learningOpportunityInstance?.academicTerm?.end
        }]
        this.specifiedBy = [{
            learningOpportunityType: semester?.learningOpportunitySpecification?.type,
        }]       
    }
}

class ForeignLanguage {
    constructor(languageLOS){
        utils.multiTagParser("title", "xml:lang",languageLOS, this)
        this.identifier = utils.parseIdentifier(languageLOS)
        this.level = languageLOS?.specifies?.learningOpportunityInstance?.resultLabel
    }
}

class Examination {
    constructor(examLOS){
        utils.multiTagParser("title", "xml:lang", examLOS, this)
        this.identifier = utils.parseIdentifier(examLOS)
        this.totalScore = examLOS?.specifies?.learningOpportunityInstance?.credit?.value
        this.hasPart = this.addComponents(examLOS.hasPart)
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
        this.title = componentLOS?.title?._
        this.type = this.title.split(" ")[2]
        this.grade = componentLOS?.specifies?.learningOpportunityInstance?.credit?.value
    }
}

function handleAchievements(parts){
    let res = []

    // qualification phase
    let qPhaseSpec = parts[0].learningOpportunitySpecification
    let learningAchievements = qPhaseSpec.hasPart.map(element => new Module(element.learningOpportunitySpecification));
    const qPhaseScore = qPhaseSpec?.specifies?.learningOpportunityInstance?.credit?.value
    const qPhase = {
        totalScore: qPhaseScore,
        hasPart: learningAchievements,
        specifiedBy: [{
            learningOpportunityType: qPhaseSpec.type,
            totalScore : qPhaseScore
        }]  
    }
    utils.multiTagParser("title", "xml:lang", qPhaseSpec, this)
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