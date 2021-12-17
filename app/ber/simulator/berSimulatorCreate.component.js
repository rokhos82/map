/**
 * @class BER.berSimulatorCreate
 * @memberOf BER
 * @desc
 */
class berSimulatorCreateController {
  constructor($scope,archive,uuid,$state) {
    this.$scope = $scope;
    this.archive = archive;
    this.uuid = uuid;
    this.$state = $state;

    this.ui = {};
    this.fleets = {};
  }

  $onInit() {
    this.resetUI();
    this.ui.greeting = [`Use the form below to setup a combat simulation.  For now, a single attacking fleet and a single defending fleet can be choosen from fleets that have been imported to the tool.`,`The max turn limiter can be freely changed; however, I would recommend it be left at 100.`];

    this.fleets = this.archive.listFleets();
  }

  resetUI() {
    // Reset the UI elements
    this.ui.simulationName = "";
    this.ui.maxTurns = 100;
    this.ui.attacker = "";
    this.ui.defender = "";
  }

  setup() {
    // This adds the simulation to an hash of simulations so that the user can setup multiple simulations.

    // Setup the simulation object
    let sim = {};

    // Generate a unique ID for the simulation
    sim.uuid = this.uuid.v4();

    // Capture the name and the maxTurn limiter
    sim.name = this.ui.simulationName;
    sim.maxTurns = this.ui.maxTurns;

    // Setup other required fields for the simulation object
    sim.status = "Pending";
    sim.turns = [];
    sim.fleets = {};
    sim.factions = {};

    // Setup the attacking faction
    let attacker = this.archive.getFleet(this.ui.attacker);
    sim.factions.attackers = {
      name: "Attackers",
      uuid: this.uuid.v4(),
      fleets: [this.ui.attacker],
      enemy: []
    };
    sim.fleets[attacker.uuid] = attacker;

    // Setup the defending faction
    let defender = this.archive.getFleet(this.ui.defender);
    sim.factions.defenders = {
      name: "Defenders",
      uuid: this.uuid.v4(),
      fleets: [this.ui.defender],
      enemy: []
    };
    sim.fleets[defender.uuid] = defender;

    // Setup enemies
    sim.factions.attackers.enemy.push(defender.uuid);
    sim.factions.defenders.enemy.push(attacker.uuid);

    console.info(sim);

    // Save the simulation object
    this.archive.setSimulation(sim.uuid,sim);
    this.archive.serializeSimulations();

    // Reset the UI
    this.resetUI();
  }

  setupAndGo() {
    this.setup();
    this.$state.go("^.view");
  }
}

berSimulatorCreateController.$inject = ["$scope","berArchive","mobius-core-uuid","$state"];

export const berSimulatorCreate = {
  bindings: {},
  controller: berSimulatorCreateController,
  template: require('./berSimulatorCreate.component.html')
};
