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
    this.ui.maxTurns = 100;
    this.ui.greeting = [`Use the form below to setup a combat simulation.  For now, a single attacking fleet and a single defending fleet can be choosen from fleets that have been imported to the tool.`,`The max turn limiter can be freely changed; however, I would recommend it be left at 100.`];

    this.fleets = this.archive.listFleets();
  }

  setup() {
    // This adds the simulation to an hash of simulations so that the user can setup multiple simulations.
    let sim = {};
    sim.name = this.ui.simulationName;
    sim.uuid = this.uuid.v4();
    sim.maxTurns = this.ui.maxTurns;
    sim.attacker = this.ui.attacker;
    sim.defender = this.ui.defender;
    sim.status = "Pending";

    this.archive.setSimulation(sim.uuid,sim);
    this.archive.serializeSimulations();

    this.$state.go("^.view");
  }
}

berSimulatorCreateController.$inject = ["$scope","berArchive","mobius-core-uuid","$state"];

export const berSimulatorCreate = {
  bindings: {},
  controller: berSimulatorCreateController,
  template: require('./berSimulatorCreate.component.html')
};
