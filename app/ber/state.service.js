export function state() {
  let _service = {};
  let _state = {
    import: {}
  };

  _service.setState = (realm,key,value) => {
    _state[realm][key] = _.cloneDeep(value);
  };

  _service.getState = (realm,key) => {
    return _.cloneDeep(_state[realm][key]);
  };

  _service.clearState = (realm) => {
    delete _state[realm];
  };

  return _service;
}

state.$inject = [];

// Service Function Definitions Below
