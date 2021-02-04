export function componentLibrary() {
  let _service = {};

  let _library = require("./componentLibrary.static.js");

  _service.listComponents = () => {
    return _library.components;
  };

  _service.getComponent = (id) => {
    return _library.components[id];
  };

  _service.setComponent = (id,obj) => {
    console.log(id,obj);
    _library.components[id] = obj;
  };

  _service.appendAttribute = (componentId,attributeString) => {
    let response = {};
    let attribute = _service.validateAttribute(attributeString);
    if(_.has(attribute,"error")) {
      response.error = attribute.error;
    } else {
      _library.components[componentId].attributes.push(attribute.attributes[0]);
    }
    return response;
  };

  _service.validateAttribute = (attributeString) => {
    // Split the attribute string on the ':' character.  This character denotes
    // the path for the attribute.
    let parts = _.split(attributeString,":")

    // The type of attribute is the first part
    let type = parts[0];

    let mergeObj = {
      attributes: []
    };
    if(type === "channels" || type === "verbs" || type === "effects") {
      mergeObj.attributes.push(attributeString);
    } else {
      let err = "components Service:attributeParser:invalidType";
      console.error(err);
      mergeObj.error = err;
    }
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
