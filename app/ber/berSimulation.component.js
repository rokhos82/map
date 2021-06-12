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
    this.events = [];
  }

  setup() {
    this.simulator.setup(this.attackers,this.defenders,{baseToHit:50,turns:5});
  }

  round() {
    this.simulation = this.simulator.singleRound();
    console.log(this.simulation);
  }

  run() {
    this.simulation = this.simulator.fight();
    console.log(this.simulation);
  }
}

berSimulationController.$inject = ["$scope","berFleets","berSimulator"];

export const berSimulation = {
  bindings: {},
  controller: berSimulationController,
  template: require('./berSimulation.component.html')
};
