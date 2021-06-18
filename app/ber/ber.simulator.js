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
    _simulation.attackers = setupFleet(attackers,"attackers");
    _simulation.defenders = setupFleet(defenders,"defenders");
    _simulation.options = options;

    // Build the target lists
    _simulation.attackers.targets = targetList(_simulation.defenders,_simulation);
    _simulation.defenders.targets = targetList(_simulation.attackers,_simulation);

    _simulation.initialized = true;

    console.info(_simulation);
  };

  _service.singleRound = () => {
    if(_simulation.initialized) {
      if(_simulation.options.turns > _simulation.turns.length) {
        // Make a copy of the current state
        let state = newState(_simulation);

        // Perform the round ==> Update the new state
        doRound(state,_simulation.options);

        // Save the new state
        _simulation.turns.push(state);

        // Make the new state the current start.
        _simulation.state = state;
        console.log(state);
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
      let done = false;
      while(_simulation.options.turns > _simulation.turns.length && !done) {
        _service.singleRound();
        done = victoryCheck(_.last(_simulation.turns));
      }

      console.log(_simulation);

      return _simulation;
    }
  };

  return _service;
}

simulator.$inject = [];

// Service Function Definitions Below //////////////////////////////////////////

function newState(simulation) {
  // TODO: Rebuild units list from scratch, don't clone it
  let state = {
    events: [],
    attackers: _.isObject(simulation.state) ? _.cloneDeep(simulation.state.attackers) : _.cloneDeep(simulation.attackers),
    defenders: _.isObject(simulation.state) ? _.cloneDeep(simulation.state.defenders) : _.cloneDeep(simulation.defenders),
    units: {},
    turn: _.isObject(simulation.state) && _.isNumber(simulation.state.turn) ? simulation.turns.length + 1 : 1
  };
  _.forEach(state.attackers.units,(attacker) => { state.units[attacker.hash] = attacker; });
  _.forEach(state.defenders.units,(defender) => { state.units[defender.hash] = defender; });
  return state;
}

function targetList(fleet,simulation) {
  // Build a list of targets from the provided fleet.
  let names = [];// _(fleet.units).map(x=>x.name).map(x=>_.camelCase(x)).value();
  _.forEach(fleet.units,(unit) => {
    let prehash = fleet.info.name + unit.name;
    let hash = _.camelCase(prehash);
    unit.hash = hash;
    names.push(hash);
    simulation.units[hash] = unit;
  });
  return names;
}

function applyDamage(action,actor,actee) {
  // Apply damage from the action to the target
  // Account for SR/AR and select health pool
  let damage = action.damage;

  if(actee.shCur > 0) {
    // Damage the shields
    actee.shCur = (actee.shCur <= damage) ? 0 : actee.shCur - damage;
  }
  else {
    // Damage the hull
    actee.hlCur = (actee.hlCur <= damage) ? 0 : actee.hlCur - damage;
  }

  console.log(actee);

  return !(actee.hlCur > 0);
}

function doDamage(action,actor,actee) {
  // Roll the damage die.
  let damageRoll = _.random(1,100,false);
  let yld = action.yield;
  let resist = actee.tags.resist;
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

function doDeath(action,state,actor,actee) {
  if(!actee.dead) {
    let faction = (actee.faction === "attackers") ? "defenders" : "attackers";
    actee.dead = true;
    _.pull(state[faction].units,actee.hash);
  }
}

function doHitRoll(action,actor,actee) {
  let t = action.target;
  let d = actee.tags.defense;

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

function doRound(state,options) {
  // Build a list of attacks to process (attack stack)
  // For each attack:
  //  Select a target
  //  Roll attack
  //  Roll damage
  //  Put effect on resolve stack
  // For each effect in resolve stack
  //  Apply the effect to the target

  let unitStack = _.flatten([state.attackers.unitHashList,state.defenders.unitHashList]);
  let resolveStack = [];

  // Log the message of the new turn
  state.events.push({msg:`Turn ${state.turn}`});
  console.info(`Turn ${state.turn}`);
  console.log(state);

  let unit = unitStack.pop();
  while(unit) {
    // Get attacks from the unit object.
    let attacks = getAttacks(unit,state);
    _.forEach(attacks,(action) => {
      action.type = "attack";
      action.actor = unit;
      resolveStack.push(action);
    });
    unit = unitStack.pop();
  }

  let action = resolveStack.pop();

  while(resolveStack.length > 0) {
    let event = {};
    event.type = action.type;
    if(action.type === "attack") {
      let actor = getUnit(action.actor,state);
      console.info(`Processing attack for ${actor.name}`);
      let target = getTarget(action.actor,state);
      action.actee = target;
      let actee = getUnit(target,state);
      let hitRoll = doHitRoll(action,actor,actee);
      action.hitRoll = hitRoll;
      // TODO: Add options that will determine what the baseToHit is
      if(hitRoll > options.baseToHit) {
        let a = _.cloneDeep(action);
        a.type = "hit";
        resolveStack.push(a);
        console.log(_.cloneDeep(resolveStack));
      }

      event.actor = actor.name;
      event.target = actee.name;
      event.msg = `${event.actor} targets ${event.target}.`;
    }
    else if(action.type === "hit") {
      let actor = getUnit(action.actor,state);
      let actee = getUnit(action.actee,state);
      console.info(`Processing hit for ${actor.name}`);
      let damage = doDamage(action,actor,actee);
      let a = _.cloneDeep(action);
      a.type = "damage";
      a.damage = damage;
      resolveStack.push(a);

      event.actor = actor.name;
      event.target = actee.name;
      event.payload = a.hitRoll;
      event.msg = `${event.actor} hit ${event.target} (${event.payload}) for ${damage} damage.`;
    }
    else if(action.type === "damage") {
      let actor = getUnit(action.actor,state);
      let actee = getUnit(action.actee,state);
      console.info(`Processing damage for ${actor.name}`);

      let dead = applyDamage(action,actor,actee);

      if(dead && !actee.dead) {
        let a = _.cloneDeep(action);
        a.type = "death";
        a.dead = dead;
        resolveStack.push(a);
      }

      event.actor = actor.name;
      event.target = actee.name;
      event.payload = action.damage;
      event.msg = `${event.target} has taken ${event.payload} damage.`;
    }
    else if(action.type === "death") {
      let actor = getUnit(action.actor,state);
      let actee = getUnit(action.actee,state);
      console.info(`Processing death for ${actee.name}`);

      doDeath(action,state,actor,actee);

      event.actor = actee.name;
      event.msg = `${event.actor} has died.`;
    }

    state.events.push(event);
    action = resolveStack.pop();
  }
}

function getAttacks(unit,state) {
  // Clone the brackets array from the unit.
  // TODO: filter out offline/out of ammo brackets.
  // TODO: handle non-bracket attacks
  console.log(unit);
  return _.cloneDeep(state.units[unit].tags.brackets);
}

function getTarget(unitHash,state) {
  let unit = state.units[unitHash];
  return _.sample(state[unit.faction].targets);
}

function getUnit(hash,state) {
  return state.units[hash];
}

function setupFleet(fleet,faction) {
  console.log(faction,fleet);
  let f = {};

  f.hash = _.camelCase(fleet.race + fleet.name);
  f.info = {
    name: fleet.name,
    race: fleet.race
  };

  f.units = {};
  f.unitHashList = [];
  _.forEach(fleet.units,(unit) => {
    unit.faction = faction;
    unit.hash = _.camelCase(f.info.name + unit.name);
    f.units[unit.hash] = unit;
    f.unitHashList.push(unit.hash);
  });

  return f;
}

function victoryCheck(state) {
  let done = (fleetDestroyedCheck(state.attackers) || fleetDestroyedCheck(state.defenders));
  return done;
}

function fleetDestroyedCheck(fleet) {
  let dead = true;

  _.forEach(fleet.units,(unit) => {
    if(unit.hlCur > 0) {
      dead = false;
    }
  });

  return dead;
}
