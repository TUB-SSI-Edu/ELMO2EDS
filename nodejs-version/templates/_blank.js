
// some usefull helper function you might want to use
const utils = require('../utils/helper')
const { handleAchievements } = require('./abitur')

class Issuer {
    constructor(issuer, levels){
        this.url = issuer.url,
        this.country = issuer.country
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

    }
}

// further you need all the classes to handle your achievements 
// and a function that constructs them

function handleAchievements(parts){

}

// TODO: your achievement classes

module.exports = {Issuer, CredentialSubject, handleAchievements}

