/**
 * @class BER.simulationControl
 * @memberOf BER
 * @desc This is a component to control a specific simulation instance.
 */
class berSimulationControlController {
  constructor($scope,$state,archive) {
    this.$scope = $scope;
    this.$state = $state;
    this.archive = archive;
  }

  $onInit() {
    this.attacker = this.archive.getFleet(this.simulation.attacker);
    this.defender = this.archive.getFleet(this.simulation.defender);
  }

  delete() {
    // Remove the simulation from the list.
    this.archive.deleteSimulation(this.simulation.uuid);
    this.archive.serializeSimulations();

    // Refresh the current state.
    this.$state.reload();
  }
}

berSimulationControlController.$inject = ["$scope","$state","berArchive"];

export const berSimulationControl = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulationControlController,
  template: require('./berSimulationControl.component.html')
};
