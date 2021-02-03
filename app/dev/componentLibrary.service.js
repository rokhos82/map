export function componentLibrary() {
  let _service = {};

  let _library = require("./componentLibrary.static.js");

  _service.listComponents = () => {
    return _library.componentLibrary;
  };

  _service.getComponent = (id) => {
    return _library.componentLibrary[id];
  };

  _service.setComponent = (id,obj) => {
    console.log(id,obj);
    _library.componentLibrary[id] = obj;
  };

  _service.parseAttribute = (attributeString) => {
    // Split the attribute string on the ':' character.  This character denotes
    // the path for the attribute.
    let parts = _.split(attributeString,":")

    // The path is all but the last part
    let pathParts = _.slice(parts,1,parts.length -1);

    // The attribute name and value is the last part.
    let attribute = _.last(parts);

    let attributeParts = _.split(attribute,"=");
    let attributeKey = attributeParts[0];
    let attributeValue = attributeParts[1];
    let path = "channels." + _.join(pathParts,".channels.") + ".attributes." + attributeKey;
    console.log(path,attributeValue);
    let mergeObj = _.set({},path,attributeValue);
    forOwnDeep(mergeObj.channels);
    console.log(mergeObj);
    return mergeObj;
  };

  return _service;
}

componentLibrary.$inject = [];

// Service Function Definitions Below
function forOwnDeepIterator(value,key,object) {
  console.log("forOwnDeepIterator",value,key,object);
  if(key !== "channels" && key !== "attributes" && _.isObject(value)) {
    value["name"] = key;
    if(_.has(value,"channels")) {
      forOwnDeep(value.channels);
    }
  }
}

function forOwnDeep(obj) {
  console.log("forOwnDeep",obj);
  _.forOwn(obj,forOwnDeepIterator);
}
