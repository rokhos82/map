/**
 * @class BER.simulationControl
 * @memberOf BER
 * @desc This is a component to control a specific simulation instance.
 */
class berSimulationControlController {
  constructor($scope,$state,archive,simulator,simulator2) {
    this.$scope = $scope;
    this.$state = $state;
    this.archive = archive;
    this.simulator = simulator2;
  }

  $onInit() {
    // Setup the attacker for the UI
    let attackerUuid = this.simulation.factions.attackers.fleets[0];
    this.attacker = this.simulation.fleets[attackerUuid];

    // Setup the defender for the UI
    let defenderUuid = this.simulation.factions.defenders.fleets[0];
    this.defender = this.simulation.fleets[defenderUuid];
  }

  delete() {
    // Remove the simulation from the list.
    this.archive.deleteSimulation(this.simulation.uuid);
    this.archive.serializeSimulations();

    // Refresh the current state.
    this.$state.reload();
  }

  initialize() {
    // Check if the simulation has already been initialized.
    // simulation.status will be Pending if no initialization has been done.
    if(this.simulation.status === "Pending") {
      // Setup the simulator
      this.simulator.setup(this.simulation);

      // Save the simulation to the archive
      this.archive.setSimulation(this.simulation.uuid,this.simulation);
      this.archive.serializeSimulations();
    }
  }

  round() {
    this.simulator.oneRound(this.simulation);
    //this.lastState = _.last(this.simulation.turns);
    //this.ui.currentTurn = _.last(this.simulation.turns);
    //this.ui.currentPage++;
    //this.saveState();
  }

  run() {
    this.simulation = this.simulator.fight();
    this.lastState = this.simulation.state;
    this.ui.currentTurn = _.last(this.simulation.turns);
    this.ui.currentPage = this.ui.currentTurn.turn;
    this.saveState();
  }
}

berSimulationControlController.$inject = ["$scope","$state","berArchive","berSimulator","berSimulator2"];

export const berSimulationControl = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulationControlController,
  template: require('./berSimulationControl.component.html')
};
