
// if not iterable do only to single objetc; if iterable to every item
function assertArray(obj){
    if (obj instanceof Array){
        return obj;
    }
    return [obj]
}

function parseLangText(type, xml, target){
    if (typeof xml[type] == "undefined"){return}
    for (const instance of assertArray(xml[type])) {
        target[type+instance.$["xml:lang"].toUpperCase()] = instance._
    }
}

module.exports = {assertArray, parseLangText}