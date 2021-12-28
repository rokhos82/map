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
      turn: 0,
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
    state.longRange = false;

    // Populate the unit stack with every unit that is not dead
    movementStack = stateGetNonDeadUnits(state);

    //
  }

  function stateGetNonDeadUnits(state) {}

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
