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
    return _.cloneDeep(_attackers);
  };

  _service.getDefenders = () => {
    return _.cloneDeep(_defenders);
  };

  return _service;
}

fleets.$inject = [];

// Service Function Definitions Below
