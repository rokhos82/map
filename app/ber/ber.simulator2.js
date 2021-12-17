export function simulator2() {
  let _service = {};

  _service.setup = (simulation) => {
    simulation.status = "Waiting";

    // Setup the factions
    _.forEach(simulation.factions,(faction,factionUuid) => {
      setupFaction(simulation,faction);
    });

    // Check for long range units
    //simulation.longRange = checkLongRange([simulation.attackers,simulation.defenders]);

    console.info(simulation);
  };

  _service.oneRound = (simulation) => {};

  _service.fight = (simulation) => {};

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
    let factionUuid = fleet.faction;
    targetList(simulation,factionUuid);
  }

  function targetList(simulation,factionUuid) {
    _.forEach(simulation.factions[factionUuid].fleets,(fleetUuid) => {
      console.info(fleetUuid);
    });
  }

  function checkLongRange() {}

  return _service;
}

simulator2.$inject = [];

// Service Function Definitions Below
