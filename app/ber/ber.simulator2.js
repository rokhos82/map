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
      longRange: checkLongRange(simulation.fleets)
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
    console.info(fleet);
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
      longRange: false
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

  // State Functions -----------------------------------------------------------
  function stateDoAttack(state,action) {
    // Process the attack action
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
        resolveStack.push(hit);
      }
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
          atk.actor.faction = actor.faction;
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
        stateDoAttack(action,state);
      }
      else if(action.type === "hit") {}
      else if(action.type === "damage") {}
      else if(action.type === "death") {}

      // Get the next action to process
      action = resolveStack.pop();
    }
    // End Main Action Processing Loop
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
      _.forEach(faction.fleets,(fleetUuid) => {
        let fleet = state.fleets[fleetUuid];
        _.forEach(fleet.units,(unit) => {
          if(!longRange) {
            // This is a normal round.
            if(!unitHasTag(unit,"reserve") && !unitHasTag(unit,"delay")) {
              parts.push(unit);
            }
            else if(unitHasTag(unit,"reserve") && unitHasTag(unit,"artillery") ) {
              reserve.push(unit);
            }
          }
          else {
            // This is the long range round.  Filter out units that don't have a long tag.
            if(!unitHasTag(unit,"reserve") && unitHasTag(unit,"long")) {
              parts.push(unit);
            }
          }
        });
      });
    });

    return parts;
  }

  function stateRefreshFactions(state) {
    // 1 Rebuild target lists
    _.forEach(state.factions,(faction) => {
      _.forEach(faction.fleets,(fleetUuid) => {
        let fleet = state.fleets[fleetUuid];
        fleet.targetList = factionTargetList(state,faction.uuid);
      });
    });
  }

  // Unit Functions ------------------------------------------------------------

  function unitGetAttacks(unit) {
    // Clone the brackets array from the unit.
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

  function unitHasTag(unit,tag) {
    let hasTag = false;

    // Check general unit tags
    if(_.has(unit.tag,tag)) {
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
        hasTag = true;
      }
    });

    return hasTag;
  }

  return _service;
}

simulator2.$inject = [];

// Service Function Definitions Below
