const helper = require('../utils/helper');

const obj = {
    "id": "notempty",
    "this": {
        "is": {
            "a": {
                "nested": {
                    "path": true
                }
            }
        }
    },
    "title": {
        "_": "Großartiger Titel",
        "$": {
            "xml:lang": "DE"
        }
    },
    "description": {
        "_": "detailed description, with many characters",
        "$": {
            "xml:lang": "en"
        }
    }
}

// isEmpty
describe('testing detection of empty objetcs', () => {
    test('empty object detected', () => {
        expect(helper.isEmpty({})).toBe(true);
    });

    test('not empty object detected', () => {
        expect(helper.isEmpty(obj)).toBe(false);
    });
});
// assertArray
describe('testing array assertion', () => {
    test('obj => [obj]', () => {
        expect(helper.assertArray(obj)).toEqual([obj]);
    });

    test('error on undefined input', () => {
        expect(helper.assertArray(undefined)).toEqual(expect.any(Error));
    });

    test('[obj, obj] => should not change', () => {
        expect(helper.assertArray([obj, obj])).toEqual([obj, obj]);
    });
});
// getKey
describe('testing key check functionality', () => {
    test('get simple key', () => {
        expect(helper.getKey('id', obj)).toEqual("notempty");
    });

    test('get complex key', () => {
        expect(helper.getKey('this.is.a.nested.path', obj)).toEqual(true);
    });

    test('get notexisting key', () => {
        expect(helper.getKey('empty', obj)).toBeUndefined();
    });
});

// parseLanguageTests
describe('testing language attributes parsing', () => {
    let res
    beforeEach(() => {
        res = {}
    });

    test('parse DE title', () => {
        helper.parseLangText('title', obj, res)
        expect(res).toHaveProperty('titleDE', 'Großartiger Titel');
    });

    test('parse EN description', () => {
        helper.parseLangText('description', obj, res)
        expect(res).toHaveProperty('descriptionEN', 'detailed description, with many characters');
    });

    test('parse not exitsing property', () => {
        helper.parseLangText('iceCream', obj, res)
        expect(res).toEqual({});
    });
})