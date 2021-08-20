import {Simulation,Turn,Faction,Fleet,Unit} from "./ber.classes.js";
import {generalTable} from "./ber.crits.js";

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

        // Update the target list
        state.attackers.targets = targetList(state.defenders);
        state.defenders.targets = targetList(state.attackers);

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
    turn: _.isObject(simulation.state) && _.isNumber(simulation.state.turn) ? simulation.turns.length + 1 : 1,
    datalink: {}
  };
  _.forEach(state.attackers.units,(attacker) => { state.units[attacker.hash] = attacker; });
  _.forEach(state.defenders.units,(defender) => { state.units[defender.hash] = defender; });
  return state;
}

function targetList(fleet,simulation) {
  let hashList = [];

  _.forEach(fleet.units,(unit) => {
    let include = true;
    // Filter out the units that are in reserve.
    if(unit.tags.reserve > 0) {
      include = false;
    }
    else if(unit.tags.delay > 0) {
      include = false;
    }
    else if(unit.dead) {
      include = false;
    }

    if(include) {
      hashList.push(unit.hash);
    }
  });

  fleet.unitHashList = hashList;
  return fleet.unitHashList;
}

function applyDamage(action,actor,actee) {
  // Apply damage from the action to the target
  // Account for SR/AR and select health pool
  // TODO: Move damage event generation here
  let damage = action.damage;
  let crit = (actor.hash === actee.hash); // The unit is damaging itself; assume this is a critical hit effect

  if(actee.shCur > 0) {
    // Damage the shields
    // Check for SR first, unless it is a crit
    if(_.isNumber(actee.tags.sr) && !crit) {
      damage = Math.max(0,damage - actee.tags.sr);
    }

    actee.shCur = (actee.shCur <= damage) ? 0 : actee.shCur - damage;
  }
  else {
    // Damage the hull
    // Check for AR first, unless it is a crit
    if(_.isNumber(actee.tags.ar) && !crit) {
      damage = Math.max(0,damage - actee.tags.ar);
    }

    actee.hlCur = (actee.hlCur <= damage) ? 0 : actee.hlCur - damage;
  }

  // TODO: Add an event about the AR/SR absorbing the damage

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
  // TODO: Move death event generation here
  if(!actee.dead) {
    //let faction = actee.faction;
    actee.dead = true;
    //_.pull(state[faction].units,actee.hash);
    removeUnit(actee,state);
  }
}

function doHitRoll(action,actor,actee) {
  console.log(`Calculating hit from ${actor.hash} against ${actee.hash}`);
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
  //let unitStack = [];
  //let movementStack = [];

  let unitStack = getParticipants(state);
  let movementStack = [];
  let critStack = [];

  _.forEach(state.attackers.units,(unit) => {
    //let unit = state.unit[hash];
    if(!unit.dead) {
      //unitStack.push(unit);
      movementStack.push(unit);
      //critStack.push(unit);
    }
  });
  _.forEach(state.defenders.units,(unit) => {
    if(!unit.dead) {
      //unitStack.push(unit);
      movementStack.push(unit);
      //critStack.push(unit);
    }
  });

  let resolveStack = [];

  // Log the message of the new turn
  state.events.push({msg:`Turn ${state.turn}`});
  console.info(`Turn ${state.turn}`);
  console.log(state);

  let unit = unitStack.pop();
  while(_.isObject(unit)) {
    // Get attacks from the unit object.
    console.info(`Processing attacks for unit: ${unit.hash}`);
    console.info(unit);
    let attacks = getAttacks(unit,state);
    _.forEach(attacks,(action) => {
      if(_.isObject(action.missile)) {
        // Process this as a missile bracket
        action.type = "missile";
      }
      else if(_.isNumber(action.multi)) {
        // The action has a multi tag.  Handle it differently
        action.type = "multi";
      }
      else {
        // Process as a regular attack bracket
        action.type = "attack";
      }
      action.actor = unit;
      resolveStack.push(action);
    });

    unit = unitStack.pop();
  }
  console.info("Initial Stack",_.cloneDeep(resolveStack));

  let action = resolveStack.pop();

  while(_.isObject(action)) {
    console.info("Current Action",_.cloneDeep(action));
    console.info("Working Stack",_.cloneDeep(resolveStack));
    console.info("Actor",_.cloneDeep(action.actor));
    // TODO: Move event logging code to each individual action.  See 2 lines below.
    let event = {};
    event.type = action.type;
    if(action.type === "missile") {
      let actor = action.actor;
      console.info(`Processing missile attack for ${actor.name}`);

      // Adjust the ammo for the missile bracket
      if(_.isNumber(action.ammo)) {
        actor.brackets[action.hash].ammo--;
      }

      // For each missile in the volley create a separate attack
      for(let i = 0;i < action.volley;i++) {
        let atk = _.cloneDeep(action);
        atk.actor = atk.missile;
        atk.actor.name = `${actor.name} Missile ${i+1}`;
        atk.actor.faction = actor.faction;
        atk.volley = atk.missile.tp;
        atk.type = "attack";
        atk.actor.tags = {"msl":true};
        resolveStack.push(atk);
        state.events.push({msg:`${actor.name} launches a missile.`});
      }
    }
    else if(action.type === "multi") {
      let actor = action.actor;
      console.info(`Processing multi attack for ${actor.name}`);

      // Multi works thusly:
      // Generate a number of attacks according to VOLLEY/MULTI (rounding down)
      // The new attack uses MULTI for the volley size
      // Any left overs are made into a smaller attack of volley size equal to VOLLEY mod MULTI
      // TODO: Add events for this step
      let totalVolley = action.volley;
      let volleySize = action.multi;
      let remainder = totalVolley % volleySize;
      while(totalVolley > remainder) {
        // Build a new action for this volley
        let nextAction = _.cloneDeep(action);
        nextAction.type = "attack";
        nextAction.volley = volleySize;
        delete nextAction.multi;

        // Push the action on the stack
        resolveStack.push(nextAction);

        // Decrease totalVolley by volleySize
        totalVolley -= volleySize;
      }

      // Build the last volley from the remainder.
      if(remainder > 0) {
        // The remainder is greater than 0.  Build the last action
        let lastAction = _.cloneDeep(action);
        lastAction.type = "attack";
        lastAction.volley = remainder;
        delete lastAction.multi;

        // Push the last action on the resolve stack
        resolveStack.push(lastAction);
      }
    }
    else if(action.type === "attack") {
      let actor = action.actor;
      console.info(`Processing attack for ${actor.name}`);

      // Adjust ammo if it is present
      if(_.isNumber(action.ammo)  && !unitHasTag(action.actor,"msl")) {
        actor.brackets[action.hash].ammo--;
      }

      let target = getTarget(action.actor,state);
      if(!!target) {
        action.actee = target;
        let actee = getUnit(target,state);
        let hitRoll = doHitRoll(action,actor,actee);
        action.hitRoll = hitRoll;
        // TODO: Add options that will determine what the baseToHit is

        let success = hitRoll > options.baseToHit

        if(success) {
          let a = _.cloneDeep(action);
          a.type = "hit";
          resolveStack.push(a);
          console.log(_.cloneDeep(resolveStack));
        }

        event.actor = actor.name;
        event.target = actee.name;
        event.msg = `${event.actor} targets ${event.target}.`;
      }
    }
    else if(action.type === "hit") {
      //let actor = getUnit(action.actor,state);
      let actor = action.actor;
      let actee = getUnit(action.actee,state);
      console.info(`Processing hit for ${actor.name}`);

      let success = true;
      let reason = "";

      // TAG: FLICKER
      if(unitHasTag(actee,"flicker")) {
        // Flicker is present.  Roll to see if the hit was really a hit.
        let flickerRoll = _.random(1,100);
        success = (flickerRoll > actee.tags.flicker);
        reason = "FLICKER";
        console.info(`${actee.name} flicker roll: ${flickerRoll}`,success);
      }

      // TAG: PD
      if(unitHasTag(actor,"msl") && unitHasTag(actee,"pd")) {
        console.info(`Rolling for PD`);
        // The attacker is a missile and the defender has point defense.
        let pdRoll = _.random(1,100);
        success = (pdRoll > actee.tags.pd);
        reason = "PD";
        console.info(`${actee.name} PD roll: ${pdRoll}`,success);
      }

      event.actor = actor.name;
      event.target = actee.name;

      if(success) {
        // The hit landed successfully!
        let damage = doDamage(action,actor,actee);
        let a = _.cloneDeep(action);
        a.type = "damage";
        a.damage = damage;
        resolveStack.push(a);

        event.payload = a.hitRoll;
        event.msg = `${event.actor} hit ${event.target} (${event.payload}) for ${damage} damage.`;
      }
      else {
        // The hit was actually a miss due to FLICKER!
        // TODO: Make this more generic?  To cover both FLICKER & PD
        let msg = "";
        if(reason === "FLICKER")
          msg = `${event.target} dodges the attack!`;
        if(reason === "PD")
          msg = `${event.target} intercepts the attack!`;

        console.log(msg);
        event.payload = false;
        event.msg = msg;
      }
    }
    else if(action.type === "damage") {
      //let actor = getUnit(action.actor,state);
      let actor = action.actor;
      let actee = getUnit(action.actee,state);
      console.info(`Processing damage for ${actor.name}`);

      let dead = applyDamage(action,actor,actee);
      critStack.push(actee);

      if(dead && !actee.dead) {
        let a = _.cloneDeep(action);
        a.type = "death";
        a.dead = dead;
        resolveStack.unshift(a);
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
      state.events.push({msg:`${unit.name} has fled the battle!`});
    }
    else if(unit.tags.flee) {
      // The unit has been fleeing.  Mark it as fled.
      doFled(unit,state);
      state.events.push({msg:`${unit.name} is fleeing the battle!`});
    }
    else if(unitDamageCheck(unit)) {
      // The unit has recieved enough damage.  Mark it as fleeing.
      doFlee(unit);
      state.events.push({msg:`${unit.name} is fleeing due to unit damage!`});
    }
    else if(unitBreakCheck(unit,state)) {
      // The unit has reached its breakoff level.  Mark it as fleeing.
      doFlee(unit);
      state.events.push({msg:`${unit.name} is fleeing due to fleet break off!`});
    }
    else if(unitDelayCheck(unit)) {
      // The unit has reached its delay counter.  Move the unit into combat.
      unitRemoveTag(unit,"delay");
      state.events.push({msg:`${unit.name} has arrived to the fight!`});
    }
    else if(unitReserveCheck(unit,state)) {
      // The unit has reached its reserve level.  Remove the unit from reserve.
      unitRemoveTag(unit,"reserve");
    }
    else if(unitTimeCheck(unit)) {
      // The unit has been in combat for its limit.  Mark it as fleeing.
      doFlee(unit);
    }
  }

  // Process any critical hits
  doCriticalHits(critStack,state);

  // Update any dynamic tags
  doDynamicTags(state);
}

function doFlee(unit) {
  console.info(`Entering doFlee(${unit.hash})`);
  // Moves the unit to a fleeing state
  unit.tags.flee = true;
}

function doFled(unit,state) {
  console.info(`Entering doFled(${unit.hash})`);
  // Moves the unit to the fled state
  // First, remove any existing flee tag
  delete unit.tags.flee;
  // Then, set the fled tag to true
  unit.tags.fled = true;
  // Remove the unit from the battle
  //removeUnit(unit,state);
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
  let breakPercentage = (100 - unit.tags.break)/100;
  let breakThreshold = state[unit.faction].hullMax * breakPercentage;

  console.info(`BREAK ${unit.tags.break}`,`THRESHOLD: ${breakThreshold}`,`CURRENT: ${state[unit.faction].hullCur}`);

  // How am I going to track current hull level for a fleet/faction?
  if(breakThreshold >= state[unit.faction].hullCur) {
    flee = true;
  }

  return flee;
}

function unitReserveCheck(unit,state) {
  console.info(`Entering unitReserveCheck()`);
  // Return true if the reserve level has been reached.
  let move = false;

  // Check if the unit has a reserve tag
  if(unit.tags.reserve && unit.tags.reserve > 0) {
    // Determine if the faction has lost enough HULL points to move the unit out of reserve.
    let reservePercentage = (100-unit.tags.reserve)/100;
    let reserveThreshold = state[unit.faction].hullMax * reservePercentage;

    console.info(`RESERVE ${unit.tags.reserve}`,`THRESHOLD: ${reserveThreshold}`,`CURRENT: ${state[unit.faction].hullCur}`);

    if(reserveThreshold >= state[unit.faction].hullCur) {
      // The unit is leaving the reserve
      console.info(`Unit ${unit.hash} is leaving reserve!`);
      move = true;
    }
  }

  return move;
}

function unitRemoveTag(unit,tag) {
  console.info(`Entering unitRemoveTag(${unit.hash},${tag})`);
  // Remove a specific tag from the unit
  delete unit.tags[tag];
}

function unitDelayCheck(unit) {
  console.info(`Entering unitDelayCheck()`);
  // Check for a delay tag.  If present update the value.  If the value <= 0 then return true.
  let arrive = false;

  if(unitHasTag(unit,"delay")) {
    console.info(`Unit ${unit.hash} has delay ${unit.tags.delay}`);
    unit.tags.delay--;

    if(unit.tags.delay <= 0) {
      arrive = true;
    }
  }

  return arrive;
}

function unitTimeCheck(unit) {
  console.info(`Entering unitTimeCheck()`)
  // Check for a time tag.
  let flee = false;
  return flee;
}

function removeUnit(unit,state) {
  console.info(`Entering removeUnit(${unit.hash})`);
  // This function removes a unit from actively participating in the combat simulation.
  // This can be due to the unit being destroyed or fleeing from combat.

  let fleet = state[unit.faction];
  // Why is the unit being removed?
  if(unit.dead) {
    // The unit has been destroyed
    fleet.destroyed.push(unit);
  }
  else if(unit.tags.fled) {
    // The unit has fled the battle space
    fleet.fled.push(unit);
  }
  else {
    // Not sure why we are removing the unit.  Should we generate an error?
    console.warn(`Unit removed for unknown reason!`);
  }
  // Remove the unit from the hashlist and the unit dictionary
  _.pullAt(fleet.unitsHashList,_.findIndex(unit.hash));
  delete fleet.units[unit.hash];

  // Update the current fleet HULL and COUNT variables for RESERVE tracking
  fleet.hullCur -= unit.hlMax;
  fleet.unitCur--;
}

function getAttacks(unit,state) {
  // Clone the brackets array from the unit.
  // TODO: handle non-bracket attacks <== MOVE to parse unit
  let brackets = _.filter(unit.tags.brackets,(bracket) => {
    let fltr = true;

    if((_.isNumber(bracket.ammo) && bracket.ammo <= 0)) {
      fltr = false;
    }
    if((_.isNumber(bracket.offline) && bracket.offline > 0)) {
      fltr = false;
    }

    // TODO: Add an event for offline/out-of-ammo weapons

    return fltr;
  });
  console.log(brackets);
  return _.cloneDeep(brackets);
}

function getTarget(unit,state) {
  // Check for targeting tags: DL, FLAK, AF, HULL, SCAN
  // Then normally generate a target
  // TODO: Break out into: getTargetDL, getTargetHull, getTargetScan, getTargetBasic
  let target = undefined;

  if(unitHasTag(unit,"dl")) {
    target = stateDatalinkGetTarget(state,unit);
  }
  else if(unitHasTag(unit,"hull")) {
    console.info(`${unit.hash} has HULL tag!`);
    // Select a target at random
    // If the target's hull matches the HULL values done.
    // Else Try again.  Try up to 5
    // TODO: Add a value to options that controls this.
    // TODO: How to handle DL & SCAN or DL & HULL
    target = false;
    let count = 0;
    let maxCount = 5;

    // While target is not selected keep searching
    while(!target) {
      // Get a random target
      let t = _.sample(state[unit.faction].targets);
      if(count > maxCount) {
        // We have tried enough times, just take the random target
        target = t;
        console.info(`Hull tageting failed to find a target!`);
      }
      else {
        // Get the target unit & check if it matches the desired HULL range
        let u = state.units[t];
        console.log(t,u);
        if(u.hlMax >= unit.tags.hull.lower && u.hlMax <= unit.tags.hull.upper) {
          target = t;
          console.info(`Hull targeting selected a target`);
          // TODO: Add event generation for the target selection using HULL
        }
      }
      count++;
    }
  }
  else if(unitHasTag(unit,"scan")) {
    // Need to filter list to the HULL range (base - range to base + range).
    // If no unit is found; weapon does not fire
    target = false;
    let targets = _.shuffle(state[unit.faction].targets);
    _.forEach(targets,(tar) => {
      // Check to see if the target matches the desired SCAN range
      let t = state.units[tar];
      if(!target && t.hlMax >= unit.tags.scan.lower && t.hlMax <= unit.tags.scan.upper) {
        target = tar;
        console.info(`Scan targeting selected a target`);
        // TODO: Add event for the target selection using SCAN
      }
    });
  }
  else {
    // Just generate a random target
    target = _.sample(state[unit.faction].targets)
  }

  return target;
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
    unit.criticalHits = {};
    f.units[unit.hash] = unit;
    hullTotal += unit.hlMax;
    unitTotal++;
    let bracketCount = 0;
    unit.brackets = {};
    _.forEach(unit.tags.brackets,(bracket) => {
      let bracketHash = "weap"+bracketCount;
      unit.brackets[bracketHash] = bracket;
      bracket.hash = bracketHash;
      bracketCount++;
    });
  });

  f.hullMax = hullTotal;
  f.hullCur = hullTotal;
  f.unitMax = unitTotal;
  f.unitCur = unitTotal;

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

function getParticipants(state) {
  // Get the units that are participating in this round of combat.
  // Exclude the following:
  // - Units with RESERVE tag
  // - Units with DELAY tag
  // - Units with FLEE tag???
  // Exceptions:
  // - Units with RESERVE & ARTILLERY tags


  let parts = [];
  let reserve = [];

  // Get the first list of units.  Those without RESERVE & DELAY
  let factions = ["attackers","defenders"];

  _.forEach(factions,(faction) => {
    let fleet = state[faction];
    _.forEach(fleet.units,(unit) => {
      if(!unitHasTag(unit,"reserve") && !unitHasTag(unit,"delay")) {
        parts.push(unit);
      }
      else if(unitHasTag(unit,"reserve") && unitHasTag(unit,"artillery") ) {
        reserve.push(unit);
      }
    });
  });

  return parts;
}

function unitHasTag(unit,tag) {
  // Check in the unit tags, then in the brackets.
  let hasTag = false;
  console.log(unit.hash || unit.name,tag,unit.tags[tag]);

  if(!!unit.tags[tag]) {
    hasTag = true;
  }

  // Check for specific tags
  if(tag == "hull" && _.isObject(unit.tags[tag])) {
    hasTag = (_.isNumber(unit.tags[tag].upper) && _.isNumber(unit.tags[tag].lower));
  }
  else if(tag == "scan" && _.isObject(unit.tags[tag])) {
    hasTag = (_.isNumber(unit.tags[tag].upper) && _.isNumber(unit.tags[tag].lower));
  }

  _.forEach(unit.tags.brackets,(bracket) => {
    if(!!bracket[tag]) {
      hasTag = true;
    }
  });

  return hasTag;
}

function doCriticalHits(unitStack,state) {
  console.info(`Entering doCriticalHits()`);
  // Critical hits are applied at:
  // - 20%
  // - 40%
  // - 60%
  // - 80%
  // - 100% - to finish with a bang!
  console.info(unitStack);

  while(unitStack.length > 0) {
    let unit = unitStack.pop();
    if(unit.shCur <= 0) {
      console.log('Checking for critical hits');
      unitCriticalHit(unit,state);
    }
  }
}

function unitCriticalHit(unit,state) {
  // Build out the thresholds.
  let threshold1 = _.round(unit.hlMax * 0.8);
  let threshold2 = _.round(unit.hlMax * 0.6);
  let threshold3 = _.round(unit.hlMax * 0.4);
  let threshold4 = _.round(unit.hlMax * 0.2);
  let threshold5 = 0;

  // Check for the first crit
  if(unit.hlCur <= threshold1 && !_.isObject(unit.criticalHits["1"])) {
    unit.criticalHits["1"] = rollCriticalHit(unit);
    applyCritialHit(unit,"1",state);
    state.events.push({msg:`${unit.name} crit: ${unit.criticalHits["1"].msg}`});
  }
  // Check for the second crit
  if(unit.hlCur <= threshold2 && !_.isObject(unit.criticalHits["2"])) {
    unit.criticalHits["2"] = rollCriticalHit(unit);
    applyCritialHit(unit,"2",state);
    state.events.push({msg:`${unit.name} crit: ${unit.criticalHits["2"].msg}`});
  }
  // Check for the third crit
  if(unit.hlCur <= threshold3 && !_.isObject(unit.criticalHits["3"])) {
    unit.criticalHits["3"] = rollCriticalHit(unit);
    applyCritialHit(unit,"3",state);
    state.events.push({msg:`${unit.name} crit: ${unit.criticalHits["3"].msg}`});
  }
  // Check for the fourth crit
  if(unit.hlCur <= threshold4 && !_.isObject(unit.criticalHits["4"])) {
    unit.criticalHits["4"] = rollCriticalHit(unit);
    applyCritialHit(unit,"4",state);
    state.events.push({msg:`${unit.name} crit: ${unit.criticalHits["4"].msg}`});
  }
  // Check for the fifth crit
  if(unit.hlCur <= threshold5 && !_.isObject(unit.criticalHits["5"])) {
    unit.criticalHits["5"] = rollCriticalHit(unit);
    applyCritialHit(unit,"5",state);
    state.events.push({msg:`${unit.name} crit: ${unit.criticalHits["5"].msg}`});
  }
}

function rollCriticalHit(unit) {
  // TODO: Add lookup code for crit table tags
  return _.sample(generalTable);
}

function applyCritialHit(unit,key,state) {
  let crit = unit.criticalHits[key];

  _.forEach(crit.effects,(effectKey) => {
    if(effectKey === "death") {
      // Kill the unit.
      console.info(`applyCritialHit(death)`);
      doDeath(null,state,null,unit);
    }
    else if(effectKey === "damage") {
      // Damage the unit
      let damage = crit["damage"];
      let dead = false;

      console.info(`applyCritialHit(damage:${damage})`);

      if(_.isNumber(damage)) {
        dead = applyDamage({damage:damage},unit,unit);
      }
      else {
        // Convert to a number...
        damage = +damage;
        dead = applyDamage({damage:damage},unit,unit);
      }
      if(dead) {
        doDeath(null,state,unit,unit);
      }
    }
    else if(effectKey === "offline") {
      let scope = crit["offline"];

      console.info(`applyCritialHit(offline:${scope})`);

      if(scope === "all") {
        // Disable all on weapons on the unit
        let brackets = unit.brackets;
        _.forEach(brackets,(weapon) => {
          weapon.offline = 1; // = _.isNumber(weapon.offline) ? weapon.offline++ : 1;
          console.info(weapon);
        });
      }
      else if(scope === "some") {
        // Disable some of the weapons on the unit
        // Random and random total
        let brackets = _.shuffle(unit.tags.brackets);
        let total = unit.tags.brackets.length;
        let number = _.random(1,total);
        for(let i = 0;i < number;i++) {
          let weapon = brackets[i];
          weapon.offline = 1; // = _.isNumber(weapon.offline) ? weapon.offline++ : 1;
          console.info(weapon);
        }
      }
      else if(scope === "one") {
        // Disable one of the weapons on the unit
        let weapon = _.sample(unit.tags.brackets);
        weapon.offline = 1; // = _.isNumber(weapon.offline) ? weapon.offline++ : 1;
        console.info(weapon);
      }
    }
    else {
      // Do nothing as the effect is pointless.
    }
  });
}

function unitUpdateAmmo(unit,state) {}

function stateDatalinkGetTarget(state,unit) {
  let target = undefined;
  let dlGroup = unit.tags.dl;
  // TODO: Make a better hash for the DL groups to allow for name collisions
  console.info(`Entering stateDatalinkGetTarget(${dlGroup})`);

  // Check if the datalink group already has a target
  if(state.datalink[dlGroup]) {
    target = state.datalink[dlGroup];
  }
  else {
    // Get a target since non exists
    state.datalink[dlGroup] = _.sample(state[unit.faction].targets);
    target = state.datalink[dlGroup];
  }

  return target;
}

function doDynamicTags(state) {
  let factions = ["attackers","defenders"];
  let tags = ["offline"];

  _.forEach(factions,(faction) => {
    let units = state[faction].units;
    _.forEach(units,(unit) => {
      _.forEach(tags,(tag) => {
        if(unitHasTag(unit,tag)) {
          unitUpdateTag(unit,tag);
        }
      });
    });
  });
}

function unitUpdateTag(unit,key) {
  console.info(`unitUpdateTag(${unit.hash}:${key})`);

  if(_.isNumber(unit.tags[key])) {
    // This tag is numeric.  Decrement it.
    unit.tags[key]--;
  }

  // Search for the tag in brackets
  _.forEach(unit.brackets,(bracket) => {
    if(_.isNumber(bracket[key])) {
      // This tag is numeric.  Decrement it.
      bracket[key]--;
    }
  });
}
