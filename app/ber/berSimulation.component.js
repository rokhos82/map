/**
 * @class BER.berSimulation
 * @memberOf BER
 * @desc Does the combat!
 */
class berSimulationController {
  constructor($scope,fleets,simulator) {
    this.$scope = $scope;
    this.fleets = fleets;
    this.simulator = simulator;
  }

  $onInit() {
    this.attackers = this.fleets.getAttackers();
    this.defenders = this.fleets.getDefenders();
  }

  setup() {
    this.simulator.setup(this.attackers,this.defenders,{});
  }
}

berSimulationController.$inject = ["$scope","berFleets","berSimulator"];

export const berSimulation = {
  bindings: {},
  controller: berSimulationController,
  template: require('./berSimulation.component.html')
};
