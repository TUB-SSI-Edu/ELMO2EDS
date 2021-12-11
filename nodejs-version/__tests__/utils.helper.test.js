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
    },
    "identifier":{
        "_": "12345",
        "$": {
            "type": "SCHAC"
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
        expect(helper.assertArray(undefined)).toEqual([]);
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

// multiTagParser
describe('testing language attributes parsing', () => {
    let res
    beforeEach(() => {
        res = {}
    });

    test('parse DE title', () => {
        helper.multiTagParser('title', "xml:lang", obj, res)
        expect(res).toHaveProperty('titleDE', 'Großartiger Titel');
    });

    test('parse EN description', () => {
        helper.multiTagParser('description', "xml:lang", obj, res)
        expect(res).toHaveProperty('descriptionEN', 'detailed description, with many characters');
    });

    test('parse not exitsing property', () => {
        helper.multiTagParser('iceCream', 'xml:lang',obj, res)
        expect(res).toEqual({});
    });

    test('parse identifier with type attr', () => {
        helper.multiTagParser('identifier', 'type',obj, res)
        expect(res).toHaveProperty('identifierSCHAC', '12345');
    });
})