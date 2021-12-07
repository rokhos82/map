export function fleets() {
  let _service = {};
  let _attackers = {};
  let _defenders = {};
  let _fleets = {};

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
    _fleets[fleet.uuid] = fleet;
  };

  _service.getFleet = (uuid) => {
    return _fleets[uuid];
  };

  _service.listFleets = () => {
    return _fleets;
  };

  return _service;
}

fleets.$inject = [];

// Service Function Definitions Below
