const utils = require('../utils/helper')
// some usefull helper function you might want to use

const keywords = ["diploma"]

class IssuerStub {
    constructor(issuer, levels){
        utils.parseIdentifier(issuer)
        this.url = issuer.url;
        this.country = issuer.country;

        utils.multiTagParser("title", "xml:lang", issuer, this)
        utils.multiTagParser("description", "xml:lang", issuer, this)

        // levels
        for (const level of utils.assertArray(levels)) {
            this["level"+level.type.toUpperCase()] = level.value
        }
    }
}

class CredentialSubjectStub {
    constructor(learner){
        utils.parseIdentifier(learner)
        this.givenName = learner.givenNames
        this.familyName = learner.familyName
        this.fullName = this.givenName +" "+this.familyName
        this.citizenship = learner.citizenship;
        this.dateOfBirth = learner.bday;
        this.placeOfBirth = learner.placeOfBirth;
        this.gender = learner.gender;
        this.achieved = []
    }

    addDegree(learnerLOS, credits) {
        this.degree = new Degree(learnerLOS, credits)
    }   
}

class Degree {
    constructor(learnerLOS, credits){

    }
}

// further you need all the classes to handle your achievements 
// and a function that constructs them

function handleAchievements(parts){
    return {}
}
// TODO: your achievement classes


// handlich extra properties
function handleExtras(elmo){
    extras = {}

    return extras
}

// TDOD: extra classes

module.exports = {IssuerStub, CredentialSubjectStub, handleAchievements, keywords}

