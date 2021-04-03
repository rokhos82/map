/**
 *
 */

class Battlefield {
  constructor() {
    this.field = {};
    this.channels = {};
  }
}

export function engineServiceFactory(componentLibrary) {
  let _appState = {};

  // Valid channels for the engine
  let _channels = {
    "presence": {
      enabled:true,
      subchannels: ["real"]
    },
    "hitpoints": {
      enabled:true,
      subchannels: ["armor","shield"]
    },
    "movement": {
      enabled:true,
      subchannels: ["real","warp"]
    }
  };

  // Valid verbs for the engine
  let _verbs = {
    "attack": { enabled:true }
  };

  // Valid effects for the engine
  let _effects = {
    "location": {
      enabled:true,
      subchannels: ["body","reverse","long"]
    }
  }

  let _factory = {};

  _factory.loadFleets = (fleetHash) => {
  };

  _factory.compileUnit = (unit) => {
    let channels = 

    return compiled;
  };

  return _factory;
}

engineServiceFactory.$inject = ["componentLibrary"];
