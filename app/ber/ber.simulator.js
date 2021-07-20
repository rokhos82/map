import {Simulation,Turn,Faction,Fleet,Unit} from "./ber.classes.js";

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
    attackers.faction = "attackers";
    attackers.enemies = ["defenders"];
    defenders.faction = "defenders";
    defenders.enemies = ["attackers"];
    let sim = new Simulation({
      factions: {
        attackers: attackers,
        defenders: defenders
      },
      options: options
    });
    console.log(sim);
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

  // Build the list of units that are participating in combat this round
  // let unitStack = _.flatten([state.attackers.unitHashList,state.defenders.unitHashList]);

  // TODO: Put unit objects in the unitStack.  Need to rewrite getAttacks to need a unit object rather than hash and state objects
  let unitStack = [];
  let movementStack = [];

  _.forEach(state.attackers.units,(hash,unit) => {
    //let unit = state.unit[hash];
    if(!unit.dead) {
      unitStack.push(hash);
      movementStack.push(hash);
    }
  });
  _.forEach(state.defenders.units,(hash,unit) => {
    if(!unit.dead) {
      unitStack.push(hash);
      movementStack.push(hash);
    }
  });

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
    console.info(resolveStack);
    let event = {};
    event.type = action.type;
    if(action.type === "attack") {
      //let actor = getUnit(action.actor,state);
      let actor = action.actor;
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
      //let actor = getUnit(action.actor,state);
      let actor = action.actor;
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
      //let actor = getUnit(action.actor,state);
      let actor = action.actor;
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
      //let actor = getUnit(action.actor,state);
      let actor = action.actor;
      let actee = getUnit(action.actee,state);
      console.info(`Processing death for ${actee.name}`);

      doDeath(action,state,actor,actee);

      event.actor = actee.name;
      event.msg = `${event.actor} has died.`;
    }

    state.events.push(event);
    action = resolveStack.pop();
  }

  // Now that combat is done.  Do movement.
  // The movement checks from highest to lowest priority are:
  // 1 - fled
  // 2 - flee
  // 3 - damage
  // 4 - break
  // 5 - reserve
  // 6 - delay
  // 7 - time
  console.info(`Starting movement checks`);
  console.log(movementStack);
  while(movementStack.length > 0) {
    // Get the unit object
    let unit = movementStack.pop();

    // Check the unit tags in the order specified above.
    // fled >> flee >> damage >> break >> reserve >> delay >> time
    if(unit.tags.fled) {
      // The unit has fled combat.  Remove the unit from the simulation.
      removeUnit(unit,state);
    }
    else if(unit.tags.flee) {
      // The unit has been fleeing.  Mark it as fled.
      doFled(unit);
    }
    else if(unitDamageCheck(unit)) {
      // The unit has recieved enough damage.  Mark it as fleeing.
      doFlee(unit);
    }
    else if(unitBreakCheck(unit,state)) {
      // The unit has reached its breakoff level.  Mark it as fleeing.
      doFlee(unit);
    }
    else if(unitReserveCheck(unit,state)) {
      // The unit has reached its reserve level.  Remove the unit from reserve.
      unitRemoveTag(unit,"reserve");
    }
    else if(unitDelayCheck(unit)) {
      // The unit has reached its delay counter.  Move the unit into combat.
      unitRemoveTag(unit,"delay");
    }
    else if(unitTimeCheck(unit)) {
      // The unit has been in combat for its limit.  Mark it as fleeing.
      doFlee(unit);
    }
  }
}

function doFlee(unit) {
  console.info(`Entering doFlee()`);
  // Moves the unit to a fleeing state
  unit.tags.flee = true;
}

function doFled(unit) {
  console.info(`Entering doFled()`);
  // Moves the unit to the fled state
  // First, remove any existing flee tag
  delete unit.tags.flee;
  // Then, set the fled tag to true
  unit.tags.fled = true;
}

function unitDamageCheck(unit) {
  console.info(`Entering unitDamageCheck()`);
  // Return true if the unit has sustained enough damage.
  let flee = false;

  // TODO: I can move some of the threshold code to the Unit object in the constructor.  As long as the damage tag is static.

  // First, check if the damage values is greater than 100.  If so, deal with shields.
  if(unit.tags.damage > 100) {
    // The damage value is greater than 100.
    // Subtract 100 and convert to percentage.  This is the percentage of shields that must remain for the unit to stay in combat.
    let shPercent = (unit.tags.damage - 100)/100;
    let shMax = unit.shMax;
    let shCur = unit.shCur;
    let shThreshold = _.round(shMax * shPercent);
    if(shCur < shThreshold) {
      flee = true;
    }
  }
  else {
    // The damage values is less than or equal to 100.
    // Convert to percentage.  This is the percentage of hull points that must remain for the unit to stay in combat.
    let hlPercent = unit.tags.damage / 100;
    let hlMax = unit.hlMax;
    let hlCur = unit.hlCur;
    let hlThreshold = _.round(hlMax * hlPercent);
    if(hlCur < hlThreshold) {
      flee = true;
    }
  }

  return flee;
}

function unitBreakCheck(unit,state) {
  console.info(`Entering unitBreakCheck()`);
  // Return true if the unit's breakoff level has been reached.
  // The breakoff threshold is the break value as a percentage of the maximum hull in the fleet.
  let flee = false;

  // Get the breakoff level from the unit or the unit's fleet.
  // TODO: Add a step to setup that adds a fleet's break value to units that do not have one specified.
  let breakPercentage = unit.tags.break/100;
  let breakThreshold = state[unit.faction].hullTotal * breakPercentage;
  // How am I going to track current hull level for a fleet/faction?

  return flee;
}

function unitReserveCheck(unit,state) {
  console.info(`Entering unitReserveCheck()`);
  // Return true if the reserve level has been reached.
  let move = false;
  return move;
}

function unitRemoveTag(unit,tag) {
  console.info(`Entering unitRemoveTag()`);
  // Remove a specific tag from the unit
}

function unitDelayCheck(unit) {
  console.info(`Entering unitDelayCheck()`);
  // Check for a delay tag.  If present update the value.  If the value <= 0 then return true.
  let arrive = false;
  return arrive;
}

function unitTimeCheck(unit) {
  console.info(`Entering unitTimeCheck()`)
  // Check for a time tag.
  let flee = false;
  return flee;
}

function removeUnit(unit,state) {
  console.info(`Entering removeUnit()`);
  // This function removes a unit from actively participating in the combat simulation.
  // This can be due to the unit being destroyed or fleeing from combat.

  let fleet = state[unit.faction];
  // Why is the unit being removed?
  if(unit.dead) {
    // The unit has been destroyed
    fleet.destroyed.push(unit);
  }
  else if(unit.tags.flee) {
    // The unit has fled the battle space
    fleet.fled.push(unit);
  }
  else {
    // Not sure why we are removing the unit.  Should we generate an error?
  }
  // Remove the unit from the hashlist and the unit dictionary
  _.pullAt(fleet.unitsHashList,_.findIndex(unit.hash));
  delete fleet.units[unit.hash];
}

function getAttacks(unit,state) {
  // Clone the brackets array from the unit.
  // TODO: filter out offline/out of ammo brackets.
  // TODO: handle non-bracket attacks
  console.log(unit);
  return _.cloneDeep(unit.tags.brackets);
}

function getTarget(unit,state) {
  //let unit = state.units[unitHash];
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
  f.destroyed = [];
  f.fled = [];
  let hullTotal = 0;
  let unitTotal = 0;

  _.forEach(fleet.units,(unit) => {
    unit.faction = faction;
    unit.hash = _.camelCase(f.info.name + unit.name);
    f.units[unit.hash] = unit;
    f.unitHashList.push(unit.hash);
    hullTotal += unit.hlMax;
    unitTotal++;
  });

  f.hullMax = hullTotal;
  f.unitMax = unitTotal;

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
