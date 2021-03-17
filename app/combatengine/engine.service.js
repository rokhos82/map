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

  _factory.compileUnit = (unitHash) => {
    let compiled = {};

    compiled.info = {};
    compiled.components = {};

    _.defaults(compiled.info,unitHash.info);

    _.forEach(unitHash.components,(component) => {
      let compiledComponent = _factory.compileComponent(component);
      _.defaults(compiled.components,compiledComponent);
    });

    console.log("Hash: ",unitHash);
    console.log("Compiled: ",compiled);

    return compiled;
  };

  _factory.compileComponent = (componentHash) => {
    console.log("Hash: ",componentHash);
    let parts = _.split(componentHash,":");
    console.log("Parts: ",parts);

    let type = _.first(parts);
    if(type === "component") {
      let componentId = _.last(parts);
      componentId = componentId.slice(0,componentId.indexOf("("));
      let rawComponent = componentLibrary.getComponent(componentId).attributes;

      console.log("Component: ",rawComponent);
    }
  };

  return _factory;
}

engineServiceFactory.$inject = ["componentLibrary"];
