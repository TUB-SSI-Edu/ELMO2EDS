
// if not iterable do only to single objetc; if iterable to every item
function assertArray(obj){
    if (!obj){
        return [];
    }
    if (obj instanceof Array){
        return obj;
    }
    return [obj];
}

function multiTagParser(tag, attribute, src, target){
    if (!src || !src.hasOwnProperty(tag)){return Error("no such property or empty soruce")}
    if (!assertArray(src[tag])[0].hasOwnProperty('$')) {
        target[tag] = src[tag]
        return
    }
    if (assertArray(src[tag]).length == 1){
        target[tag] = src[tag]?._
        return
    }
    for (const instance of assertArray(src[tag])) {
        target[tag+instance?.$[attribute]?.toUpperCase()] = instance?._;
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

function parseIdentifier(obj){
    let res = assertArray(obj.identifier).map(el => {
        return {
            schemeID: el?.$?.type,
            value: el?._
        }
    })
    if(res.length == 0){ return undefined}
    return res.length == 1 ? res[0] : res
}

module.exports = {assertArray, multiTagParser, isEmpty, getKey, parseIdentifier}