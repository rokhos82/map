export function fleets() {
  let _service = {};
  let _attackers = {};
  let _defenders = {};

  _service.setAttackers = (atk) => {
    _attackers = _.cloneDeep(atk);
  };

  _service.setDefenders = (dfd) => {
    _defenders = _.cloneDeep(dfd);
  };

  _service.getAttackers = () => {
    return _attackers;
  };

  _service.getDefenders = () => {
    return _defenders;
  };

  return _service;
}

fleets.$inject = [];

// Service Function Definitions Below
