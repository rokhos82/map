export function simulator() {
  let _service = {};
  let _state = {};
  let _initialized = false;

  _service.setup = (attackers,defenders,options) => {
    // Save the passed information to the state object
    _state.attackers = attackers;
    _state.defenders = defenders;
    _state.options = options;

    // Setup the master unit index
    _state.units = {};

    // Setup factions on each unit
    _.forEach(_state.attackers,(attacker) => { attacker.faction = "attackers"; });
    _.forEach(_state.defenders,(defender) => { defender.faction = "defenders"; });

    // Build the target lists
    _state.attackers.targets = targetList(_state.defenders,_state);
    _state.defenders.targets = targetList(_state.attackers,_state);

    _initialized = true;
  };

  _service.singleRound = () => {
    if(_initialized) {
      let state = _
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

// Service Function Definitions Below //////////////////////////////////////////

function targetList(fleet,state) {
  // Build a list of targets from the provided fleet.
  let names = [];// _(fleet.units).map(x=>x.name).map(x=>_.camelCase(x)).value();
  _.forEach(fleet.units,(unit) => {
    let prehash = fleet.name + unit.name;
    let hash = _.camelCase(prehash);
    names.push(hash);
    state.units[hash] = unit;
  });
  return names;
}

function applyDamage(action,target) {
  // Apply damage from the action to the target
  // Account for SR/AR and select health pool
  if(target.curSH > 0) {
    // Damage the shields
  }
  else {
    // Damage the hull
  }
}

function doDamage(action,target) {
  // Roll the damage die.
  let damageRoll = _.random(1,100,false);
  let yield = action.yield;
  let resist = target.resist;
  damageRoll = damageRoll + yeild - resist;

  // Bounds check the damageRoll: 0 <= damageRoll <= 100
  if(damageRoll > 100) {
    damageRoll = 100;
  }
  else if(damageRoll < 0) {
    damageRoll = 0;
  }

  let damage = action.volley * damageRoll / 100;
  return damage;
}

function doHitRoll(action,target) {
  let t = action.target;
  let d = target.defense;

  // Bounds check the hit modifier
  // TODO: Make this work with globals for non 50.1 to hit values
  let mod = 0;
  if(t>d) {
    mod = (t-d) > 40 ? 40 : (t-d);
  }
  else {
    mod = (t-d) < -40 ? -40 : (t-d);
  }

  return _.random(1,100,false) + mod;
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
      attack.actor = unit;
      resolveStack.push(attack);
    });
    unit = unitStack.pop();
  }

  let action = resolveStack.pop();
  while(action) {
    if(action.type === "attack") {
      let target = getTarget(action.unit,state);
      action.target = getUnit(target,state);
      let hitRoll = doHitRoll(action,action.target);
      // TODO: Add options that will determine what the baseToHit is
      if(hitRoll > 50) {
        action.type = "hit";
        resolveStack.push(action);
      }
    }
    else if(action.type === "hit") {
      let damage = doDamage(action,action.target);
      action.type = "damage";
      action.damage = damage;
      resolveStack.push(action);
    }
    else if(action.type === "damage") {
      let target = action.target;
    }

    action = resolveStack.pop();
  }
}

function getAttacks(unit) {
  // Clone the brackets array from the unit.
  // TODO: filter out offline/out of ammo brackets.
  // TODO: handle non-bracket attacks
  return _.cloneDeep(unit.tags.brackets);
}

function getTarget(unit,state) {
  return _.sample(state[unit.faction].targets);
}

function getUnit(hash,state) {
  return state.unit[hash];
}
