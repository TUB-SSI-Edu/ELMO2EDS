const credParser = require('../utils/credentialParser')._testing;

// loadTemplates & keywords
describe('loading templates and keywords', () => {
    test('check if all keywords were found', () => {
        expect(credParser.templateDict).toEqual({
            abitur: 'abitur.js',
            'transcript of records': 'transcriptofrecords.js',
            bachelor: 'transcriptofrecords.js',
            master: 'transcriptofrecords.js'
        });
    });

    test('test keywords -> template', () => {
        let keyw = ['bachelor']
        expect(credParser.getDocTypes(keyw)).toEqual(['transcriptofrecords.js']);

        keyw = ['abitur', 'zeugnis']
        expect(credParser.getDocTypes(keyw)).toEqual(['abitur.js']);

        keyw = ['abitur', 'zeugnis', 'master']
        expect(credParser.getDocTypes(keyw)).toEqual(['abitur.js', 'transcriptofrecords.js']);
    });

    test('undefined keyword', () => {
        let keyw = [undefined]
        expect(credParser.getDocTypes(keyw)).toEqual([]);
    });

    test('unknown keyword keyword', () => {
        let keyw = ['schwimmabzeichen']
        expect(credParser.getDocTypes(keyw)).toEqual([]);
    });
});

// validateTemplates
describe('verify templates', () => {
    beforeEach(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
      });

    test('check valid template integrity', () => {
        const requiredTemplateProperties = {
            keywords: obj => {return Array.isArray(obj) == true},
            Issuer: obj => typeof obj == 'function',
            CredentialSubject: obj => typeof obj == 'function',
            handleAchievements: obj => typeof obj == 'function'
        }
        expect(credParser.validateTemplate('abitur.js', requiredTemplateProperties)).toEqual(true);
        expect(credParser.validateTemplate('transcriptofrecords.js', requiredTemplateProperties)).toEqual(true);
    });

    test('missing property', () => {
        const requiredTemplateProperties = {
            missing: obj => typeof obj == 'function'
        }
        expect(credParser.validateTemplate('abitur.js', requiredTemplateProperties)).toEqual(false);
    });

    test('wrong type', () => {
        const requiredTemplateProperties = {
            keywords: obj => typeof obj == 'function',
        }
        expect(credParser.validateTemplate('abitur.js', requiredTemplateProperties)).toEqual(false);
    });
});