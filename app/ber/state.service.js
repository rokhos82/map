export function state($window) {
  let _service = {};
  let _state = {
    import: {}
  };

  _service.setState = (realm,key,value) => {
    // Store the key,value pair in the _state object
    if(!_.isObject(_state[realm])) {
      _state[realm] = {};
    }
    _state[realm][key] = _.cloneDeep(value);

    // Store the key,value pair in localStorage
    let lsKey = `${realm}.${key}`;
    $window.localStorage.setItem(lsKey,angular.toJson(value));
  };

  _service.getState = (realm,key) => {
    let lsKey = `${realm}.${key}`;
    // Is the key in the _state object?
    if(_service.hasState(realm,key)) {
      // Yes, return the object stored in _state.
      return _.cloneDeep(_state[realm][key]);
    }
    // Is the key in localStorage?
    else if($window.getItem(lsKey)) {
      // Yes, save the object to the _state object and return it;
      let val = angular.fromJson($window.getItem(lsKey));
      _service.setState(realm,key,val);
      return val;
    }
    else {
      // The key is not in the _state object nor is it in localStorage.
      return false;
    }
  };

  _service.clearState = (realm) => {
    delete _state[realm];
  };

  _service.hasState = (realm,key) => {
    return (_.isObject(_state[realm]) && _.has(_state[realm],key));
  };

  return _service;
}

state.$inject = ["$window"];

// Service Function Definitions Below
