export function fleets(stateService) {
  let _service = {};
  let _attackers = {};
  let _defenders = {};
  let _fleets = {};

  let fleetRealm = "fleet";

  // Load anything from localStorage via the stateService

  _service.setAttackers = (atk) => {
    _attackers = _.cloneDeep(atk);
  };

  _service.setDefenders = (dfd) => {
    _defenders = _.cloneDeep(dfd);
  };

  _service.getAttackers = () => {
    return _.cloneDeep(_attackers);
  };

  _service.getDefenders = () => {
    return _.cloneDeep(_defenders);
  };

  _service.setFleet = (fleet) => {
    // Add the fleet to the _fleets object
    _fleets[fleet.uuid] = fleet;

    // Send the fleet to the stateService for serialization
    stateService.setState(fleetRealm,fleet.uuid,fleet);
  };

  _service.getFleet = (uuid) => {
    if(_.has(_fleets,uuid)) {
      return _fleets[uuid];
    }
    else {
      console.warn("Fleet unknown");
      return false;
    }
  };

  _service.listFleets = () => {
    return _fleets;
  };

  return _service;
}

fleets.$inject = ["berState"];

// Service Function Definitions Below
