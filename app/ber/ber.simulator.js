export function simulator() {
  let _service = {};
  let _state = {};
  let _initialized = false;

  // The master simulation state object
  let _simulation = {
    units: {},
    turns: [],
    initialized: false
  };

  _service.setup = (attackers,defenders,options) => {
    // Save the passed information to the state object
    _simulation.attackers = attackers;
    _simulation.defenders = defenders;
    _simulation.options = options;

    // Setup factions on each unit
    _.forEach(_simulation.attackers.units,(attacker) => { attacker.faction = "attackers"; });
    _.forEach(_simulation.defenders.units,(defender) => { defender.faction = "defenders"; });

    // Build the target lists
    _simulation.attackers.targets = targetList(_simulation.defenders,_simulation);
    _simulation.defenders.targets = targetList(_simulation.attackers,_simulation);

    _simulation.initialized = true;
  };

  _service.singleRound = () => {
    if(_simulation.initialized) {
      if(_simulation.options.turns > _simulation.turns.length) {
        let state = newState(_simulation);
        doRound(state);
        _simulation.turns.push(state);
      }
      else {
        console.warn("Maximum number of turns reached.")
      }
      return _simulation;
    }
    else {
      console.error("Simulator not initialized!");
    }
  };

  _service.fight = () => {
    if(_simulation.initialized) {
      while(_simulation.options.turns > _simulation.turns.length) {
        _service.singleRound();
      }

      return _simulation;
    }
  };

  return _service;
}

simulator.$inject = [];

// Service Function Definitions Below //////////////////////////////////////////

function newState(simulation) {
  let state = {
    events: [],
    attackers: _.isObject(simulation.state) ? _.cloneDeep(simulation.state.attackers) : _.cloneDeep(simulation.attackers),
    defenders: _.isObject(simulation.state) ? _.cloneDeep(simulation.state.defenders) : _.cloneDeep(simulation.defenders),
    units: _.isObject(simulation.state) ? _.cloneDeep(simulation.state.units) : simulation.units,
    turn: _.isObject(simulation.state) ? simulation.state.turn+1 : 1
  };
  return state;
}

function targetList(fleet,simulation) {
  // Build a list of targets from the provided fleet.
  let names = [];// _(fleet.units).map(x=>x.name).map(x=>_.camelCase(x)).value();
  _.forEach(fleet.units,(unit) => {
    let prehash = fleet.name + unit.name;
    let hash = _.camelCase(prehash);
    names.push(hash);
    simulation.units[hash] = unit;
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

  let damage = _.round(action.volley * damageRoll / 100,0);

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
    action = resolveStack.pop();
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
