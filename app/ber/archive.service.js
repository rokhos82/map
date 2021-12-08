export function archive($localStorage) {
  let _service = {};
  let simRealm = "simulations";
  let fleetsRealm = "fleets";

  let _simulations = {};
  let _fleets = {};

  // Simulation Archive Services -----------------------------------------------
  _service.setSimulation = (key,simulation) => {
      // Store the key,fleet pair in the _fleets object
      // Store a copy of the fleet
      _simulations[key] = _.cloneDeep(simulation);
  };

  _service.getSimulation = (key) => {
    // Set the return value to false in the event that the key does
    // not exist in the _simulations object
    let simulation = false;

    // Does the key exist?
    if(_.has(_simulations,key)) {
      // Return a copy of the object in storage
      simulation = _.cloneDeep(_simulations[key]);
    }

    // Return the value/object
    return simulation;
  };

  _service.listSimulations = () => {
    // Return a copy of all of the fleets in storage
    return _.cloneDeep(_simulations);
  };

  _service.deleteSimulation = (key) => {
    // Delete the fleet identified by key
    delete _simulations[key];
  };

  _service.serializeSimulations = () => {
    // Save the entire simulations object to $localStorage
    $localStorage.set(simRealm,_simulations);
  };

  _service.deserializeSimulations = () => {
    // Retrieve the simulation objects from $localStorage.
    // If the key doesn't exist, initialize to an empty object.
    _simulations = $localStorage.get(simRealm) || {};
  };

  // Fleet Archive Services ----------------------------------------------------
  _service.setFleet = (key,fleet) => {
    // Store the key,fleet pair in the _fleets object
    // Store a copy of the fleet
    _fleets[key] = _.cloneDeep(fleet);
  };

  _service.getFleet = (key) => {
    // Set the return value to false in the event that the key does
    // not exist in the _fleets object
    let fleet = false;

    // Does the key exist?
    if(_.has(_fleets,key)) {
      // Return a copy of the object in storage
      fleet = _.cloneDeep(_fleets[key]);
    }

    // Return the value/object
    return fleet;
  };

  _service.listFleets = () => {
    // Return a copy of all of the fleets in storage
    return _.cloneDeep(_fleets);
  };

  _service.deleteFleet = (key) => {
    // Delete the fleet identified by key
    delete _fleets[key];
  };

  _service.serializeFleets = () => {
    // Save the entire fleets object to $localStorage
    $localStorage.set(fleetsRealm,_fleets);
  };

  _service.deserializeFleets = () => {
    // Retrieve the fleets object from $localStorage.
    // If the key doesn't exist, initialize to an empty object.
    _fleets = $localStorage.get(fleetsRealm);// || {};
    console.info(_fleets);
  };

  return _service;
}

archive.$inject = ["$localStorage"];

// Service Function Definitions Below
