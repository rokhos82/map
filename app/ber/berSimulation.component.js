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
    this.ui.maxTurns = 10;
    this.ui.currentPage = 1;
  }

  setup() {
    this.simulator.setup(this.attackers,this.defenders,{baseToHit:50,turns:this.ui.maxTurns});
  }

  round() {
    this.simulation = this.simulator.singleRound();
    this.lastState = _.last(this.simulation.turns);
    this.ui.currentTurn = _.last(this.simulation.turns);
    console.log(this.simulation);
  }

  run() {
    this.simulation = this.simulator.fight();
    this.lastState = this.simulation.state;
    this.ui.currentTurn = _.last(this.simulation.turns);
    this.ui.currentPage = this.ui.maxTurns;
  }

  toggleView(key,index) {
    if(_.isNumber(index) && index >= 0) {
      this.ui[key][index] = !this.ui[key][index];
    }
    else {
      this.ui[key] = !this.ui[key];
    }
  }

  changeTurn() {
    this.ui.currentTurn = this.simulation.turns[this.ui.currentPage - 1];
  }
}

berSimulationController.$inject = ["$scope","berFleets","berSimulator"];

export const berSimulation = {
  bindings: {},
  controller: berSimulationController,
  template: require('./berSimulation.component.html')
};
