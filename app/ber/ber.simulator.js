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
    turn: _.isObject(simulation.state) ? simulation.turns.length+1 : 1
  };
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

function applyDamage(action,state) {
  // Apply damage from the action to the target
  // Account for SR/AR and select health pool
  let actor = action.actor;
  let actee = state.units[action.actee.hash];
  console.log(state,action,actee);
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

  return (actee.curHL > 0);
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

function doDeath(action,state) {
  let actee = action.actee;
  let faction = (actee.faction === "attackers") ? "defenders" : "attackers";
  _.pull(state[faction].units,actee.hash);
}

function doHitRoll(action,state) {
  let actor = getUnit(action.actor,state);
  let actee = getUnit(action.actee,state);

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

function doRound(state) {
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
      let hitRoll = doHitRoll(action,state);
      action.hitRoll = hitRoll;
      // TODO: Add options that will determine what the baseToHit is
      if(hitRoll > 50) {
        let a = _.cloneDeep(action);
        a.type = "hit";
        resolveStack.push(a);
        console.log(_.cloneDeep(resolveStack));
      }

      event.actor = actor.name;
      event.target = action.actee.name;
      event.msg = `${event.actor} targets ${event.target}.`;
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
      event.payload = a.hitRoll;
      event.msg = `${event.actor} hit ${event.target} (${event.payload}) for ${damage} damage.`;
    }
    else if(action.type === "damage") {
      console.info(`Processing damage for ${action.actor.name}`);

      let dead = applyDamage(action,state);

      if(dead) {
        let a = _.cloneDeep(action);
        a.type = "death";
        a.dead = dead;
        resolveStack.push(a);
      }

      event.actor = action.actor.name;
      event.target = action.actee.name;
      event.payload = action.damage;
    }
    else if(action.type === "death") {
      console.info(`Processing death for ${action.actee.name}`);

      doDeath(action,state);

      event.actor = action.actee.name;
      event.msg = `${event.actor} died.`;
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
