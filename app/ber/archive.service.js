export function archive(stateService) {
  let _service = {};
  let simRealm = "simulations";

  _service.setSimulation = (key,simulation) => {
    // This function uses the state service to save a simulation object paired to a key value
    // key is expected to be a string.
    // simulation is expected to be an object.

    if(_.isString(key) && _.isObject(simulation)) {
      stateService.setState(simRealm,key,simulation);
    }
    else {
      if(!_.isString(key)) {
        console.error("Archive service was expecting a string as the key");
      }
      if(!_.isObject(simulation)) {
        console.error("Archive service was expecting an object for the simulation");
      }
    }
  };

  _service.getSimulation = (key) => {
    // This function retieves a simulation object from the state service give a key.
    // key is expected to be a string.

    if(_.isString(key)) {
      return stateService.getState(simRealm,key);
    }
    else {
      console.error("Archive service was expecting the key to be a string");
      return false;
    }
  };

  _service.listSimulations = () => {
    // This function returns the simulations hash object
    return stateService.listState(simRealm);
  };

  return _service;
}

archive.$inject = ["berState"];

// Service Function Definitions Below
