export function simulator2() {
  let _service = {};

  _service.setup = (simulation) => {
    simulation.status = "Waiting";

    console.info(`Simulation:`,simulation);

    // Setup the factions
    _.forEach(simulation.factions,(faction,factionUuid) => {
      setupFaction(simulation,faction);
    });

    // Check for long range units
    simulation.longRange = checkLongRange(simulation.fleets);

    console.info(simulation);
  };

  _service.oneRound = (simulation) => {
    console.info(`One Round Simulation`,simulation);
    // Is the simulation initialized?
    if(simulation.status === "Waiting") {
      // Have we reached the turn limit?
      if(simulation.maxTurns > simulation.turns.length) {
        // We have NOT reached the turn limit.  Run another turn.
        simulation.turns.push({});
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
