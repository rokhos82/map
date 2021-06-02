export function simulator() {
  let _service = {};
  let _state = {};
  let _initialized = false;

  _service.setup = (attackers,defenders,options) => {
    // Save the passed information to the state object
    _state.attackers = attackers;
    _state.defenders = defenders;
    _state.options = options;

    _.forEach(_state.attackers,(attacker) => { attacker.targetFaction = "defenders"; });
    _.forEach(_state.defenders,(defender) => { defender.targetFaction = "attackers"; });

    // Build the target lists
    _state.attackers.targets = targetList(_state.defenders);
    _state.defenders.targets = targetList(_state.attackers);

    _initialized = true;
  };

  _service.singleRound = () => {
    if(_initialized) {
      _state.events = [];
      doRound();
      return _state;
    }
    else {
      console.error("Simulator not initialized!");
    }
  };

  return _service;
}

simulator.$inject = [];

// Service Function Definitions Below

function targetList(fleet) {
  // Build a list of targets from the provided fleet.
  let names = _(fleet.units).map(x=>x.name).map(x=>_.camelCase(x)).value();
  return names;
}

function doRound(state) {
  // Build a list of attacks to process (attack stack)
  // For each attack:
  //  Select a target
  //  Roll attack
  //  Roll damage
  //  Put effect on resolve stack
  // For each effect in resolve stack
  //  Apply the effect to the target

  let unitStack = _.merge(_state.attackers,_state.defenders);
  let resolveStack = [];

  let unit = unitStack.pop();
  while(unit) {
    // Get attacks from the unit object.
    let attacks = getAttacks(unit);
    _.forEach(attacks,(attack) => {
      attack.type = "attack";
      resolveStack.push(attack);
    });
    unit = unitStack.pop();
  }

  let attack = resolveStack.pop();
  while(attack) {
    if(attack.type === "attack") {
      let target = _.sample()
    }

    attack = resolveStack.pop();
  }
}

function getAttacks(unit) {
  return _.cloneDeep(unit.tags.brackets);
}
