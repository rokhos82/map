export function simulator() {
  let _service = {};
  let _state = {};

  _service.setup = (attackers,defenders,options) => {
    // Save the passed information to the state object
    _state.attackers = attackers;
    _state.defenders = defenders;
    _state.options = options;

    _state.attackers.targets = targetList(_state.defenders);
  };

  return _service;
}

simulator.$inject = [];

// Service Function Definitions Below

function targetList(fleet) {
  // Build a list of targets from the provided fleet.
  let names = _(fleet.units).map(x=>x.name).map(x=>_.camelCase(x)).value();
  console.log(names);
}
