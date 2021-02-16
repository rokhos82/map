export function techLibrary() {
  let _service = {};

  let _library = require("./techLibrary.static.js");

  _service.listTechs = () => {
    return _library.techs;
  };

  _service.getTech = (id) => {
    return _.cloneDeep(_library.techs[id]);
  };

  _service.setTech = (id,obj) => {
    _library.techs[id] = obj;
  };

  return _service;
}

techLibrary.$inject = [];

// Service Function Definitions Below
