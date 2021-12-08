export function state($localStorage) {
  let _service = {};
  let _state = {
    import: {}
  };

  let _realms = [];
  let realmsListKey = "berStateRealms";

  _service.serialize = () => {
    // Save the _realms variable to localStorage
    $localStorage.set(realmsListKey,_realms);

    _.forEach(_realms,(realm) => {
      $localStorage.set(realm,_state[realm]);
    });
  };

  _service.serializeRealm = (realm) => {
    // Save the _realms variable to localStorage
    $localStorage.set(realmsListKey,_realms);

    // Save the realm object to localStorage
    $localStorage.set(realm,_state[realm]);
  };

  _service.deserialize = () => {
    // Get the _realms variable from localStorage
    let realms = $localStorage.get(realmsListKey);

  };

  _service.deserializeRealm = (realm) => {};

  _service.setState = (realm,key,value) => {
    // Store the key,value pair in the _state object

    // Does the realm exist?
    if(!_.isObject(_state[realm])) {
      // No, create and track the realm.
      _realms.push(realm);
      _state[realm] = {};
    }

    // Clone the object and save to the _stateObject
    _state[realm][key] = _.cloneDeep(value);

    // Store the entire realm in localStorage
    _service.serializeRealm(realm);
  };

  _service.getState = (realm,key) => {
    let lsKey = `${realm}.${key}`;
    // Is the key in the _state object?
    if(_service.hasState(realm,key)) {
      // Yes, return the object stored in _state.
      return _.cloneDeep(_state[realm][key]);
    }
    // Is the key in localStorage?
    else if($localStorage.get(lsKey)) {
      // Yes, save the object to the _state object and return it;
      let val = $localStorage.get(lsKey);
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

  _service.deleteState = (realm,key) => {
    delete _state[realm][key];
  };

  _service.hasState = (realm,key) => {
    return (_.isObject(_state[realm]) && _.has(_state[realm],key));
  };

  _service.listState = (realm) => {
    if(_.has(_state,realm)) {
      return _state[realm];
    }
    else {
      _state[realm] = {};
      return _state[realm];
    }
  }

  return _service;
}

state.$inject = ["$localStorage"];

// Service Function Definitions Below
