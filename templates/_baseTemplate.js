const utils = require('../utils/helper')
// some usefull helper function you might want to use

const keywords = ["diploma"]

class Issuer {
    constructor(issuer, levels){
        this.url = issuer.url;
        this.country = issuer.country;
    }
}

class CredentialSubject {
    constructor(learner){
        utils.multiTagParser('identifier', 'type', learner, this);
        this.firstName = learner.givenNames;
        this.familyName = learner.familyName;
        this.citizenship = learner.citizenship;
        this.dateOfBirth = learner.bday;
        this.placeOfBirth = learner.placeOfBirth;
        this.gender = learner.gender;
        this.currentAddress = learner.currentAddress;
        this.degree = {}
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

module.exports = {Issuer, CredentialSubject, handleAchievements, keywords}
