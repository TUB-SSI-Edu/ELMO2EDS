
// if not iterable do only to single objetc; if iterable to every item
function assertArray(obj){
    if (!obj){
        return Error('ofject is nullish')
    }
    if (obj instanceof Array){
        return obj;
    }
    return [obj]
}

function parseLangText(type, xml, target){
    if (typeof xml[type] == "undefined"){return Error("no such property")}
    for (const instance of assertArray(xml[type])) {
        target[type+instance?.$["xml:lang"]?.toUpperCase()] = instance?._
    }
}

function isEmpty(obj) {  
    return Object.keys(obj).length === 0;
}
// maybe use ?. JS operator instead
function getKey(key, obj) {
    return key.split('.').reduce(function(a,b){
      return a && a[b];
    }, obj);
}
/*
function find(theObject) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = getObject(theObject[i]);
            if (result) {
                break;
            }   
        }
    }
    else
    {
        for(var prop in theObject) {
            console.log(prop + ': ' + theObject[prop]);
            if(prop == 'id') {
                if(theObject[prop] == 1) {
                    return theObject;
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = getObject(theObject[prop]);
                if (result) {
                    break;
                }
            } 
        }
    }
    return result;
}
*/

module.exports = {assertArray, parseLangText, isEmpty, getKey}