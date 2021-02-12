export function unitLibrary() {
  let _service = {};

  let _library = require("./unitLibrary.static.js");

  _service.listUnits = () => {
    return _library.units;
  };

  _service.getUnit = (id) => {
    return _.cloneDeep(_library.units[id]);
  };

  _service.setUnit = (id,obj) => {
    _library.units[id] = obj;
  };

  return _service;
}

unitLibrary.$inject = [];

// Service Function Definitions Below
