const { urlencoded } = require("express");
const utils = require("../utils/helper");
const base = require("./_baseTemplate");
// some usefull helper function you might want to use

// not needed because is a special more versatile conversion mode
// thatis supposed to convert any ELMO document
const keywords = [];

class Issuer extends base.IssuerStub {
  constructor(issuer, levels) {
    super(issuer, levels);
  }
}

class CredentialSubject extends base.CredentialSubjectStub {
  constructor(learner) {
    super(learner);
  }
}

// further you need all the classes to handle your achievements
// and a function that constructs them

function handleAchievements(elmo) {
  let root = [];
  for (let report of elmo.report) {
    let learningA = new LearningAchievement(
      report?.learningOpportunitySpecification
    );
    root.push(learningA);
  }
  return root;
}
// TODO: your achievement classes

class LearningAchievement {
  constructor(LOS) {
    const LOI = LOS.specifies.learningOpportunityInstance;

    this.id = LOS?.id || utils.makeId("LACH");
    this.identifier = LOS?.identifier;
    this.title = LOS?.title;
    this.definition = LOS?.description;
    this.additionalNote = "type:" + LOS?.type;
    this.wasDerivedFrom = new Assesment(LOS, LOI)
    this.wasInfluencedBy = new LearningActivity(LOS, LOI)
    this.hasPart = LOS.hasPart.map(
      (el) => new LearningAchievement(el)
    );

    // TODO/missing: 
    // academic term
    // engagement hours
    // status
    // gradingSchemeLocalId
    // gradingScheme
  }
}

class Assesment {
  constructor(LOS, LOI) {
    this.identifier = this.identifier;
    this.id = utils.makeId("AS");
    this.title = LOS.title;
    this.grade = LOI.resultLabel || LOI.status;
    this.shortenedGrading = LOI.shortenedGrading;
    this.resultDistribution = LOI.resultDistribution;
  }
}

class LearningActivity{
    constructor(LOS, LOI){
        this.id = utils.makeId("LACT");
        this.startedAtTime = LOI.start
        this.endedAtTime = LOI.date
        this.specifiedBy = new LearningActivitySpec(LOS, LOI)
        this.workload = LOI.engagementHours
    }
}

class LearningActivitySpec{
    constructor(LOS, LOI){
        this.id = utils.makeId("LACTSPEC");
        this.learningActivityType = LOS.type
        this.teaches = new LearningSpec(LOS, LOI)
    }
}

class LearningSpec{
    constructor(LOS, LOI){
        this.id = utils.makeId("LSPEC");
        this.learningOpportunityType = LOS.type
        this.iSCEDFCode = LOS.iscedCode
        this.educationalSubject = LOS.subjectArea
        this.homePage = LOS.url
        this.eCTSCreditPoints = LOI.credit
        this.educationLevel = LOI.level
        this.language = LOI.languageOfInstruction
        this.targetGroup = LOI.grouping
        this.volumeOfLearning = LOI.engagementHours

    }
}

// handling extra properties
function handleExtras(elmo) {
  extras = {};
  extras.attachment = elmo.report.reduce((attachments, el) => {
    if (el?.attachment) {
      attachments.push(el?.attachment);
    }
  }, []);
  return extras;
}

// TDOD: extra classes

module.exports = {
  IssuerStub,
  CredentialSubjectStub,
  handleAchievements,
  keywords,
};
