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
    _.forEach(_state.attackers.units,(attacker) => { attacker.faction = "attackers"; });
    _.forEach(_state.defenders.units,(defender) => { defender.faction = "defenders"; });

    // Build the target lists
    _state.attackers.targets = targetList(_state.defenders,_state);
    _state.defenders.targets = targetList(_state.attackers,_state);

    _initialized = true;
  };

  _service.singleRound = () => {
    if(_initialized) {
      let state = _
      _state.events = [];
      doRound(_state);
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

function doDamage(action) {
  // Roll the damage die.
  let damageRoll = _.random(1,100,false);
  let yld = action.yield;
  let resist = action.actee.tags.resist;
  damageRoll = damageRoll + yld - resist;

  // Bounds check the damageRoll: 0 <= damageRoll <= 100
  if(damageRoll > 100) {
    damageRoll = 100;
  }
  else if(damageRoll < 0) {
    damageRoll = 0;
  }

  let damage = action.volley * damageRoll / 100;

  console.info(`damage: ${damage}`);
  return damage;
}

function doHitRoll(action) {
  let t = action.target;
  let d = action.actee.tags.defense;

  // Bounds check the hit modifier
  // TODO: Make this work with globals for non 50.1 to hit values
  let mod = 0;
  if(t>d) {
    mod = (t-d) > 40 ? 40 : (t-d);
  }
  else {
    mod = (t-d) < -40 ? -40 : (t-d);
  }

  let toHit = _.random(1,100,false) + mod;
  console.info(`to hit roll: ${toHit}`);

  return toHit;
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

  let unitStack = _.flatten([state.attackers.units,state.defenders.units]);
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
  //console.log(resolveStack);
  while(resolveStack.length > 0) {
    let event = {};
    event.type = action.type;
    if(action.type === "attack") {
      console.info(`Processing attack for ${action.actor.name}`);
      let target = getTarget(action.actor,state);
      action.actee = getUnit(target,state);
      let hitRoll = doHitRoll(action);
      // TODO: Add options that will determine what the baseToHit is
      if(hitRoll > 50) {
        let a = _.cloneDeep(action);
        a.type = "hit";
        resolveStack.push(a);
        console.log(_.cloneDeep(resolveStack));
      }

      event.actor = action.actor.name;
      event.target = action.actee.name;
      event.payload = hitRoll;
    }
    else if(action.type === "hit") {
      console.info(`Processing hit for ${action.actor.name}`);
      let damage = doDamage(action);
      let a = _.cloneDeep(action);
      a.type = "damage";
      a.damage = damage;
      resolveStack.push(a);

      event.actor = a.actor.name;
      event.target = a.actee.name;
      event.payload = damage;
    }
    else if(action.type === "damage") {
      console.info(`Processing damage for ${action.actor.name}`);
      let target = action.actee;

      event.actor = action.actor.name;
      event.target = action.actee.name
    }

    state.events.push(event);
    //console.log(resolveStack);
    action = resolveStack.pop();
    //console.log(action);
  }
}

function getAttacks(unit) {
  // Clone the brackets array from the unit.
  // TODO: filter out offline/out of ammo brackets.
  // TODO: handle non-bracket attacks
  console.log(unit);
  return _.cloneDeep(unit.tags.brackets);
}

function getTarget(unit,state) {
  return _.sample(state[unit.faction].targets);
}

function getUnit(hash,state) {
  return state.units[hash];
}
