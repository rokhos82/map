export function simulator2() {
  let _service = {};

  _service.setup = (simulation) => {
    simulation.status = "Waiting";

    console.info(`Simulation:`,simulation);

    // Setup the factions
    _.forEach(simulation.factions,(faction,factionUuid) => {
      setupFaction(simulation,faction);
    });

    // Create the initial state object for the simulation
    let state = {
      events: [],
      factions: _.cloneDeep(simulation.factions),
      fleets: _.cloneDeep(simulation.fleets),
      units: {},
      turn: 0,
      datalink: {},
      longRange: checkLongRange(simulation.fleets),
      options: simulation.options
    };

    // Create the master units list
    _.forEach(state.fleets,(fleet) => {
      state.units = _.merge(state.units,fleet.units);
    });

    // Set turn 0 to be the initial state
    simulation.turns.push(state);

    // Check for long range units
    simulation.longRange = state.longRange;

    console.info(simulation);
  };

  _service.oneRound = (simulation) => {
    console.info(`One Round Simulation`,simulation);
    // Is the simulation initialized?
    if(simulation.status === "Waiting") {
      // Have we reached the turn limit?
      if(simulation.maxTurns > simulation.turns.length) {
        // We have NOT reached the turn limit.  Run another turn.
        // New turn tasks
        // 1 Create a new state object from the last state (initail, turn 0 state should be done in setup)
        // 2 Refresh faction information (target lists, datalink, etc.)
        // 3 Do Round
        // 4 Save the new state

        // 1 Create a new state
        let state = newState(simulation);

        // 2 Refresh faction information
        stateRefreshFactions(state,simulation.options);

        // 3 Do Round
        stateDoRound(state,simulation.options);

        // 4 Save the new state
        simulation.turns.push(state);
      }
      else {
        // We have reached the turn limit.  Log an error.
        console.warn(`Maximum number of turns reached in simulation ${simulation.name} (${simulation.uuid}).`);
        simulation.status = "Finished";
      }
    }
  };

  _service.fight = (simulation) => {};

  // Simulation Functions ------------------------------------------------------
  function setupFaction(simulation,faction) {
    console.info(`Faction:`,faction);
    // Setup fleets in the faction
    _.forEach(faction.fleets,(fleetUuid) => {
      let fleet = simulation.fleets[fleetUuid];
      fleet.faction = faction.uuid;
      setupFleet(simulation,fleet);
    });
  }

  function setupFleet(simulation,fleet) {
    console.info(`Fleet:`,fleet);
    // Get the target list for this fleet.

    // Get the UUID of the fleet's own faction
    let fleetFactionUuid = fleet.faction;

    // Get the faction object from the simulation
    let faction = simulation.factions[fleetFactionUuid];

    // Get the list of enemy factions from the fleet's faction.
    // TODO: Generalize this for multiple factions in the enemy array
    let factionUuid = faction.enemy[0];
    fleet.targetList = factionTargetList(simulation,factionUuid);

    // Setup each unit
    _.forEach(fleet.units,(unit) => {
      setupUnit(simulation,faction,fleet,unit);
    });

    console.info(fleet);
  }

  function setupUnit(simulation,faction,fleet,unit) {
    console.info(`Unit:`,unit);

    // Setup the fleetId for use in the simulation
    unit.fleetId = fleet.uuid;

    // Setup the factionId for use in the simulation
    unit.factionId = faction.uuid;

    // Setup the blank check collection
    unit.check = {};
  }

  function newState(simulation) {
    // Grab the old state object
    let oldState = _.last(simulation.turns);

    // Create the new state object
    let state = {
      events: [],
      factions: _.cloneDeep(oldState.factions),
      fleets: _.cloneDeep(oldState.fleets),
      units: {},
      turn: oldState.turn+1,
      datalink: {},
      longRange: false,
      options: oldState.options
    };

    state.longRange = checkLongRange(state.fleets);

    // Create the master units list
    _.forEach(state.fleets,(fleet) => {
      state.units = _.merge(state.units,fleet.units);
    });

    return state;
  }

  // Faction Functions ---------------------------------------------------------
  function factionTargetList(simulation,factionUuid) {
    // Builds the list of valid targets for the provided faction.
    console.info(factionUuid,simulation);
    let targets = [];

    // Loop through each fleet in the faction.
    // For each fleet, look at all the units.  If that unit is valid
    // add it to the target list that is returned.
    _.forEach(simulation.factions[factionUuid].fleets,(fleetUuid) => {
      let fleet = simulation.fleets[fleetUuid];
      targets.push(fleetTargetList(fleet));
    });

    console.info(targets);
    targets = _.flattenDeep(targets);
    return targets;
  }

  // Fleet Functions -----------------------------------------------------------
  function fleetTargetList(fleet) {
    let targets = [];

    // Loop through each unit and build the target list
    _.forEach(fleet.units,(unit) => {
      // Add the unit to the factions units list.
      console.info(unit);
      let include = true;

      // Filter out units that have the reserve tag
      if(unit.tags.reserve > 0) {
        include = false;
      }
      // Filter out units that have the delay tag
      else if(unit.tags.delay > 0) {
        include = false;
      }
      // Filter out units that are dead
      else if(unit.dead) {
        include = false;
      }

      // If the unit should be includes, add the unit's UUID to the targets list
      if(include) {
        targets.push(unit.uuid);
      }
    });

    return targets;
  }

  function checkLongRange(fleets) {
    // Assume there are no long range weapons.
    let lr = false;

    // Check each fleet
    _.forEach(fleets,(fleet) => {
      // Check each unit
      _.forEach(fleet.units,(unit) => {
        // Does the unit have a long range weapon?
        if(unitHasTag(unit,"long")) {
          // Yes, lr needs to be set to true.
          lr = true;
        }
      });
    });

    return lr;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Action Functions ----------------------------------------------------------
  //////////////////////////////////////////////////////////////////////////////
  function actionDoDamage(action,actor,actee) {
    // Calculate the damage the action inflicts on the actee.
    console.info(`actionDoDamage(${actor.name} > ${actee.name})`);

    // Roll for damage
    let damageRoll = _.random(1,100,false);

    // Adjust for YIELD and RESIST
    let yld = action.yield || 0;
    let resist = actee.tags.resist || 0;
    damageRoll = damageRoll + yld - resist;

    // Bounds check the damangeRoll
    // 0 <= damageRoll <= 100
    damageRoll = Math.max(0,damageRoll);
    damageRoll = Math.min(damageRoll,100);

    // Calculate actual damage
    let damage = _.round(action.volley * (damageRoll / 100),0);
    return damage;
  }

  //////////////////////////////////////////////////////////////////////////////
  // State Functions -----------------------------------------------------------
  //////////////////////////////////////////////////////////////////////////////
  function stateDatalinkGetTarget(state,unit) {
    // This function determines that target for a datalink group given a unit.
    // If the datalink group does not have a target then use the unit to get a target and save it for later.
    // If the datalink group does have a target then simply return that target.
    let dlGroupName = unit.tags.dl;
    let target = false;
    if(!!state.datalink[dlGroupName]) {
      // The group already has a target.
      target = stateGetUnitById(state,state.datalink[dlGroupName]);
    }
    else {
      // TODO: How to handle units with different targetting tags.  I think an error in the fleet file might be best.
      // TODO: Maybe I should push this part out to a preturn processing so that a group as a whole fails in a given turn.
      // Get a random target
      console.info(`Selecting target for datalink group: ${dlGroupName}`);
      target = unitGetTagetRandom(unit,state);

      // Save the UUID for later use by other group members.
      state.datalink[dlGroupName] = target.uuid;
    }
    return target;
  }

  function stateDoAttack(state,action,stack) {
    // Process the attack action
    console.info(`Attack(${action.actor.name})`,action.actor);
    let actor = action.actor;

    // Adjust ammo if it is present
    // TODO: Generalize for ROF on weapons
    if(_.isNumber(action.ammo) && !unitHasTag(actor,"msl")) {
      actor.brackets[action.hash].ammo--;
    }

    // Get a target for the attack
    let actee = unitGetTarget(actor,state);

    // Check to see if we really got a target
    if(_.isObject(actee)) {
      // The target is truthy!
      action.actee = actee;

      // Calculate the toHit roll for the attack
      let hitRoll = unitDoHitRoll(actor,actee,action);
      action.hitRoll = hitRoll;

      // TODO: Add options that will determine what the baseToHit is
      // Calculate the success.  This is used in multiple places and calculated onece.
      let success = hitRoll > state.options.baseToHit;

      // Check if the attack was successful.
      if(success) {
        // The attack was a success!
        // Create a hit action and add it to the processing stack
        let hit = _.cloneDeep(action);
        hit.type = "hit";
        stack.push(hit);
      }
    }
  }

  function stateDoDamage(state,action,stack) {
    // Apply the damage to the target
    let actor = action.actor;
    let actee = action.actee;
    console.info(`stateDoDamage(${actee.name}:${action.damage})`);

    // Calculate if the unit is dead
    let dead = unitApplyDamage(actee,action,actor);
    // Flag the unit for a critical hit check
    actee.check.crit = true;

    // Now process the death if neccessary
    if(dead && !actee.dead) {
      // Don't do this if the unit is already dead.
      // This happens as multiple attacks can land on the same target in the same turn.
      // Flag the unit to have a death check done after the main combat round.
      actee.check.death = true;
    }

    // TODO: Add an event for this...
  }

  function stateDoHit(state,action,stack) {
    // The attack was a success.  Do the hit action now.
    let actor = action.actor;
    let actee = action.actee;
    console.info(`Hit(${actor.name} > ${actee.name})`);

    let success = true;

    // Check to see if the target has FLICKER
    if(unitHasTag(actee,"flicker")) {
      // Flicker is present.  Roll to see if the hit was really a hit.
      let flickerRoll = _.random(1,100);
      success = (flickerRoll <= actee.tags.flicker);
      // TODO: Log an event for the attack missing
    }

    // Check to see if the target has PD if the actor is a missile
    // If the attack was already a miss due to flicker don't check for PD
    if(success && unitHasTag(actor,"msl") && unitHasTag(actee,"pd")) {
      let pdRoll = _.random(1,100);
      success = (pdRoll <= actee.tags.pd);
      // TODO: Log an event for the missile being destroyed
    }

    // Check to see if the attack was a success
    if(success) {
      // It really did hit.  Generate a new event for applying the damage.
      let damage = actionDoDamage(action,actor,actee);
      let act = _.cloneDeep(action);
      act.type = "damage";
      act.damage = damage;
      stack.push(act);
      // TODO: Log an event for the successful hit!
    }
  }

  function stateDoRound(state,options) {
    // Setup the stacks used to process the turn;
    let unitStack = [];
    let movementStack = [];
    let critStack = [];
    let resolveStack = [];

    // Get a list of units that are participating in the round
    unitStack = stateGetParticipants(state);

    // Turn off the long range flag
    // TODO: Generalize this to an arbitrary number of long range turns
    //state.longRange = false;
    // NOTE: I don't think this is needed.  longRange gets refreshed with newState()

    // Populate the unit stack with every unit that is not dead
    movementStack = stateGetNonDeadUnits(state);

    // Log the new turn event
    let evt = {
      msg: `Turn ${state.turn}`
    };
    state.events.push(evt);
    console.info(evt.msg);
    console.info(state);
    console.info(`Participants`,unitStack);

    // Process the units in the unitStack for attacks and other actions ////////
    let unit = unitStack.pop();
    // While there are units
    while(_.isObject(unit)) {
      // Log events for this unit
      let evt = {
        msg: `Processing actions for unit ${unit.name} (${unit.uuid})`
      };
      console.info(evt.msg);
      console.info(unit);

      // Get the attacks for the unit
      let attacks = unitGetAttacks(unit);
      console.info(attacks);

      // Loop through the attacks and setup the action objects
      _.forEach(attacks,(action) => {
        // Is the attack a missile attack?
        if(_.isObject(action.missile)) {
          // Yes, set the type to `missile`
          action.type = "missile";
        }
        // Does the attack have a `multi` tag?
        else if(_.isNumber(action.multi)) {
          // Yes, set the type to `multi`
          action.type = "multi";
        }
        // Does the attack have a `bp` object?
        else if(_.isObject(action.bp)) {
          // Yes, set the type to `boarding`
          action.type = "boarding";
        }
        // Catch all for all other actions
        else {
          // Set the type to `attack`
          action.type = "attack";
        }

        // Set the actions actor to the unit
        action.actor = unit;

        // Add the action to the resolveStack action stack.
        resolveStack.push(action);
      });

      // Get the next unit to process
      unit = unitStack.pop();
    }

    console.info(`Initial Stack`,_.cloneDeep(resolveStack));

    // Process the actions for the round ///////////////////////////////////////
    let action = resolveStack.pop();

    while(_.isObject(action)) {
      // Process the current action

      // What is the type of the action?
      // Check for a missile attack
      if(action.type === "missile") {
        // Process the missile attack
        let actor = action.actor;

        // Adjust the ammo for the missile action (if it uses ammo)
        if(_.isNumber(action.ammo)) {
          // The action does require ammo.  Decrement the ammo count by one
          // TODO: Need to generalize to account for ROF on launchers
          actor.brackets[action.hash].ammo--;
        }

        // Create a new action for each missile in the volley
        for(let i = 0;i < action.volley;i++) {
          // Start with this action
          let atk = _.cloneDeep(action);

          // Change the action to reflect that it is a missile
          atk.actor = atk.missile;
          atk.actor.name = `${actor.name} Missile ${i+1}`;
          atk.actor.factionId = actor.factionId;
          atk.actor.fleetId = actor.fleetId;
          atk.volley = atk.missile.tp;
          atk.type = "attack";
          atk.actor.tags = {"msl":true};

          // Push the new action onto the action stack (resolveStack)
          resolveStack.push(atk);

          // Push the event for this action into the event queue
          let evt = {
            msg: `${actor.name} launches a missile.`
          };
          state.events.push(evt);
          console.info(`${evt.msg}`);
        }
      }
      // Check for a multi attack
      else if(action.type === "multi") {
        // Process the multi attack
        let actor = action.actor;

        // Multi works thusly:
        // Generate a number of attacks according to VOLLEY/MULTI (rounding down)
        // The new attack uses MULTI for the volley size
        // Any left overs are made into a smaller attack of volley size equal to VOLLEY mod MULTI
        let totalVolley = action.volley;
        let volleySize = action.multi;
        let remainder = totalVolley % volleySize; // <== The remainder leftover after all full sized multi packets are used

        // Loop until we have used all of the full multi packets
        while(totalVolley > remainder) {
          // Build a new action for this volley
          let atk = _.cloneDeep(action);
          atk.type = "attack";
          atk.volley = volleySize;

          // Delete the multi attribute so that we don't loop
          delete atk.multi;

          // Push the new attack on the action stack (resovleStack)
          resolveStack.push(atk);

          // Decrease the totalVolley by the volleySize
          totalVolley -= volleySize;
        }
        // End multi-volley loop

        // Check to see if remaineder is non-zero
        if(remainder > 0) {
          // The remaineder is non-zero.
          // Create a new action using the remainder as the volley
          let atk = _.cloneDeep(action);
          atk.type = "attack";
          atk.volley = remainder;

          // Don't forget to delete multi.  Otherwise we loop.
          delete atk.multi;

          // Push the remaining volley on to the process stack
          resolveStack.push(atk);
        }
      }
      // Check for boading action
      else if(action.type === "boarding") {
      }
      // Check for boarded action
      else if(action.type === "boarded") {
      }
      // Check for the standard attack action
      else if(action.type === "attack") {
        stateDoAttack(state,action,resolveStack);
      }
      // Check for the hit action
      else if(action.type === "hit") {
        stateDoHit(state,action,resolveStack);
      }
      // Check for the damage action
      else if(action.type === "damage") {
        stateDoDamage(state,action,resolveStack);
      }
      // This is the end of the main processing loop.

      // Get the next action to process
      action = resolveStack.pop();
    }
    // End Main Action Processing Loop

    // Now that combat is done do checks that were flagged during the combat loop.
    // This is for things like critical hits and death
    let checkStack = [];
    // Build the checkStack by seeing if the check collection has any keys.
    _.forEach(state.units,(unit) => {
      if(_.size(unit.check) > 0) {
        checkStack.push(unit);
      }
    });
    // Process the checkStack
    while(checkStack.length > 0) {
      // Get the next unit object to process
      let unit = checkStack.pop();

      if(unit.check.crit) {
        // Process the crit if necessary
        console.info(`Processing crit check for ${unit.name}`);
      }
      // Always do death check last incase any other check results in death
      if(unit.check.death) {
        // Process the death of the unit
        console.info(`Processing death check for ${unit.name}`);
      }
    }

    // Now that post-combat checks are done.  Do the movement processing.
    // The movement checks from highest to lowest priority are:
    // 1 - fled
    // 2 - flee
    // 3 - damage
    // 4 - break
    // 5 - reserve
    // 6 - delay
    // 7 - time
    while(movementStack.length > 0) {
      // Get the unit object
      let unit = movementStack.pop();
      console.info(`Processing movement for ${unit.name}`);

      // Check the unit tags in th eorder specified above
      // fled >> flee >> damage >> break >> reserve >> delay >> time
      if(unit.tags.fled) {
        // The unit has fled combat.  Remove the unit from the simulation.
        stateRemoveUnit(state,unit);
      }
      else if(unit.tags.flee) {
        // The unit has been fleeing.  Mark if as fled.
        unitDoFled(unit,state);
      }
      else if(unitCheckDamage(unit,state)) {
        unitDoFlee(unit);
      }
      else if(unitCheckBreak(unit,state)) {
        unitDoFlee(unit);
      }
      else if(unitCheckDelay(unit,state)) {
        unitTagRemove(unit);
      }
      else if(unitCheckReserve(unit,state)) {
        unitTagRemove(unit);
      }
      else if(unitCheckTime(unit,state)) {
        unitDoFlee(unit);
      }
    }
  }

  function stateGetNonDeadUnits(state) {
    let units = [];

    // Loop through all of the units in the state object
    _.forEach(state.units,(unit) => {
      // Check if the unit is dead
      if(!unit.dead) {
        // The unit is not dead, add it to the stack
        units.push(unit);
      }
    });

    return units;
  }

  function stateGetParticipants(state) {
    // Get the units that are participating in this round of combat.
    // Exclude the following:
    // - Units with RESERVE tag
    // - Units with DELAY tag
    // - Units with FLEE tag???
    // Exceptions:
    // - Units with RESERVE & ARTILLERY tags

    let parts = [];
    let reserve = [];
    let longRange = state.longRange;

    // Get the first list of units.  Those without RESERVE & DELAY

    _.forEach(state.factions,(faction) => {
      console.info(`stateGetParticipants:faction(${faction.name})`);
      _.forEach(faction.fleets,(fleetUuid) => {
        let fleet = state.fleets[fleetUuid];
        console.info(`stateGetParticipants:fleet(${fleet.name})`);
        _.forEach(fleet.units,(unit) => {
          if(!longRange) {
            console.info(`Standard Mode`);
            // This is a normal round.
            if(!unitHasTag(unit,"reserve") && !unitHasTag(unit,"delay")) {
              parts.push(unit);
            }
            else if(unitHasTag(unit,"reserve") && unitHasTag(unit,"artillery") ) {
              reserve.push(unit);
            }
          }
          else {
            console.info(`Long Range Mode`);
            // This is the long range round.  Filter out units that don't have a long tag.
            if(!unitHasTag(unit,"reserve") && unitHasTag(unit,"long")) {
              parts.push(unit);
            }
          }
        });
      });
    });

    console.log(parts);

    return parts;
  }

  function stateGetUnitById(state,hash) {
    // Get the unit object associated with the UUID.
    return state.units[hash];
  }

  function stateRefreshFactions(state) {
    // 1 Rebuild target lists
    _.forEach(state.factions,(faction) => {
      _.forEach(faction.fleets,(fleetUuid) => {
        let fleet = state.fleets[fleetUuid];
        let factionUuid = faction.enemy[0];
        fleet.targetList = factionTargetList(state,factionUuid);
      });
    });
  }

  function stateRemoveUnit(state,unit) {}

  //////////////////////////////////////////////////////////////////////////////
  // Unit Functions ------------------------------------------------------------
  //////////////////////////////////////////////////////////////////////////////
  function unitApplyDamage(unit,action) {
    // Apply the damage from the action to the unit
    let damage = action.damage;
    let crit = action.crit;
    let hullHit = false;

    // TODO: Check to see if damage overflows to the HULL from the SHIELDS
    // Check to see if the unit has shields
    if(unit.shCur > 0) {
      // Yep, damage the shields
      // If the damage is from a crit then ignore SR & RESIST
      // Check for SR
      if(_.isNumber(unit.tags.sr) && !crit) {
        damage = Math.max(0,damage - unit.tags.sr);
      }
      // Check for RESIST
      if(_.isNumber(unit.tags.resist) && !crit) {
        damage = _.round(damage * (unit.tags.resist / 100));
      }

      // Decrease the unit's shields by damage amount
      unit.shCur = Math.max(0,unit.shCur - damage);
    }
    else {
      // Damage the hull instead
      // If the damage is from a crit then ignore AR & RESIST
      // Check for AR
      if(_.isNumber(unit.tags.ar) && !crit) {
        damage = Math.max(0,damage - unit.tags.ar);
      }
      // Check for RESIST
      if(_.isNumber(unit.tags.resist) && !crit) {
        damage = _.round(damage * (unit.tags.resist / 100));
      }

      // Decrease the unit's hull by the damage amount
      unit.hlCur = Math.max(0,unit.hlCur - damage);
      hullHit = true; // This matters if the unit is a fighter
    }

    // Determine if the unit is dead
    // Conditions for death
    // 1 - the current hull value is 0
    // 2 - the hull was hit and the unit has a FIGHTER tag
    let dead = (unit.hlCur <= 0 || (unit.tags.fighter && hullHit));
    return dead;
  }

  function unitCheckBreak(unit) {}

  function unitCheckDamage(unit) {}

  function unitCheckDelay(unit) {}

  function unitCheckReserve(unit) {}

  function unitCheckTime(unit) {}

  function unitDoFled(unit) {}

  function unitDoFlee(unit) {}

  function unitDoHitRoll(unit,target,action) {
    // Calculate the to hit roll for the unit

    let t = action.target;
    let d = target.tags.defense;

    // Check for extremely disparate target and defense values.
    let mod = 0;
    if(t>d) {
      // The target is greater than the defense
      // Ensure that the total modified is less than or equal to 40
      // Otherwise, it violates the 10% chance to hit at a minimum rule
      mod = (t-d) > 40 ? 40 : (t-d);
    }
    else {
      // The target is less than the defense
      // Ensure that the total modifier is greater than or equal to -40
      // Otherwise, it violates the 10% chance to miss at a minimum rule
      mod = (t-d) < -40 ? -40 : (t-d);
    }

    // Calculate the actual toHit roll for the action
    // This is a d100 + the modifier calculated above.
    let toHit = _.random(1,100,false) + mod;

    return toHit;
  }

  function unitGetAttacks(unit) {
    // Clone the brackets array from the unit.
    console.info(`unitGetAttacks`,unit.brackets);
    let brackets = _.filter(unit.brackets,(bracket) => {
      let fltr = true;

      // Does the bracket need ammo and is there ammo left?
      if(_.isNumber(bracket.ammo) && bracket.ammo <= 0) {
        fltr = false;
      }

      // Does the bracket have an offline tag?
      if(_.isNumber(bracket.offline) && bracket.offline > 0) {
        fltr = false;
      }

      return fltr;
    });

    // Return a copy of the filter brackets array.
    return _.cloneDeep(brackets);
  }

  function unitGetTarget(unit,state) {
    // Check for targeting tags: DL, FLAK, AF, HULL, SCAN
    // Then generate a target for the action
    // TODO: Split into multiple functions with this as the entry point

    let target = undefined;

    // Check if the unit has a datalink tag
    if(unitHasTag(unit,"dl")) {
      // Yes, then ask the state for the target for that datalink group
      target = stateDatalinkGetTarget(state,unit);
    }
    else if(unitHasTag(unit,"hull")) {
      // TODO: Need to check brackets as well...
      // Get the target based on the hull tag
      target = unitGetTargetHull(unit,state);
    }
    else if(unitHasTag(unit,"scan")) {
      // The unit has a scan tag.  Select a target using that
      // TODO: This also needs to check the action...for HULL and DL as well
      target = unitGetTargetScan(unit,state);
    }
    else {
      // Get a random target from the taget list
      target = unitGetTagetRandom(unit,state);
    }

    console.info(`unitGetTarget(${unit.name}):${target.name}`);

    return target;
  }

  function unitGetTagetRandom(unit,state) {
    // Get a random target from the list of available targets for this unit
    let targetList = state.fleets[unit.fleetId].targetList;

    // Get a random UUID from the targetList for the unit's fleet
    let targetId = _.sample(targetList);

    // Get the actual unit object related to the target id.
    let target = state.units[targetId];

    // Return the target object
    return target;
  }

  function unitGetTargetHull(unit,state) {
    // Get a random target based on the hull parameters

    // TODO: Add a value to options that controls max tries before a target is just used
    // TODO: What to do about action hull tags vs unit hull tags
    let target = false;
    let tries = 0;
    let maxTries = 5;
    let hullMax = unit.tags.hull.upper;
    let hullMin = unit.tags.hull.lower;

    // Keep trying until we have a target
    while(!target) {
      let u = unitGetTagetRandom(unit,state);

      // Have we tried too many times
      if(tries > maxTries) {
        // Just use this target regardless
        target = u;
      }
      else {
        // Does the target fall within the hull range?
        let hull = u.hlMax;
        if(hull >= hullMin && hull <= hullMax) {
          target = u;
        }
      }

      // Increment the try counter
      tries++;
    }

    return target;
  }

  function unitGetTargetScan(unit,state) {
    // Get a unit that matches the hull range from the SCAN tag.
    // If no unit is found, then the weapon does not fire
    let target = false;
    let targets = _.shuffle(state.fleets[unit.fleedId].targetList);
    let scanMin = unit.tags.scan.lower;
    let scanMax = unit.tags.scan.upper;

    // Look at each unit
    _.forEach(targets,(id) => {
      let t = state.units[id];
      let hull = t.hlMax;

      // Is the target in the hull range?
      if(!target && hull >= scanMin && hull <= scanMax) {}
    });
  }

  function unitHasTag(unit,tag) {
    let hasTag = false;

    // Check general unit tags
    if(!!unit.tags[tag]) {
      hasTag = true;
    }

    // These tags require specifc processing
    if(tag == "hull" && _.isObject(unit.tags[tag])) {
      // The HULL tag is a compound tag and the upper and lower values must be numbers
      hasTag = (_.isNumber(unit.tags[tag].upper) && _.isNumber(unit.tags[tag].lower));
    }
    else if(tag == "scan" && _.isObject(unit.tags[tag])) {
      // The SCAN tag is a compound tag and the upper and lower values must be numbers;
      hasTag = (_.isNumber(unit.tags[tag].upper) && _.isNumber(unit.tags[tag].lower));
    }

    // Check weapon tags
    _.forEach(unit.brackets,(bracket) =>{
      if(_.has(bracket,tag)) {
        console.info(`Checking for ${tag}`,bracket);
        hasTag = true;
      }
    });

    return hasTag;
  }

  return _service;
}

simulator2.$inject = [];

// Service Function Definitions Below
