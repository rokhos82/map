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
    this.ui = {};
  }

  $onInit() {
    this.attackers = this.fleets.getAttackers();
    this.defenders = this.fleets.getDefenders();
    this.events = [];
    this.ui.output = false;
    this.ui.sim = false;
    this.ui.turns = [false,false,false,false,false];
    this.ui.lastState = false;
  }

  setup() {
    this.simulator.setup(this.attackers,this.defenders,{baseToHit:50,turns:10});
  }

  round() {
    this.simulation = this.simulator.singleRound();
    this.lastState = _.last(this.simulation.turns);
    console.log(this.simulation);
  }

  run() {
    this.simulation = this.simulator.fight();
    this.lastState = _.last(this.simulation.turns);
    console.log(this.simulation);
  }

  toggleView(key,index) {
    if(_.isNumber(index) && index >= 0) {
      this.ui[key][index] = !this.ui[key][index];
    }
    else {
      this.ui[key] = !this.ui[key];
    }
  }
}

berSimulationController.$inject = ["$scope","berFleets","berSimulator"];

export const berSimulation = {
  bindings: {},
  controller: berSimulationController,
  template: require('./berSimulation.component.html')
};
