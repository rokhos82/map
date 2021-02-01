export function componentLibrary() {
  let _service = {};

  let _library = require("./componentLibrary.static.js");

  _service.getComponents = () => {
    return _library.componentLibrary;
  };

  return _service;
}

componentLibrary.$inject = [];

// Service Function Definitions Below
