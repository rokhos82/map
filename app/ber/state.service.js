export function state() {
  let _service = {};
  let _state = {
    import: {}
  };

  _service.setState = (realm,key,value) => {
    if(!_.isObject(_state[realm])) {
      _state[realm] = {};
    }
    _state[realm][key] = _.cloneDeep(value);
  };

  _service.getState = (realm,key) => {
    return _.cloneDeep(_state[realm][key]);
  };

  _service.clearState = (realm) => {
    delete _state[realm];
  };

  _service.hasState = (realm,key) => {
    return (_.isObject(_state[realm]) && _.has(_state[realm],key));
  };

  return _service;
}

state.$inject = [];

// Service Function Definitions Below
