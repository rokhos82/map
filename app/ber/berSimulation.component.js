/**
 * @class BER.berSimulation
 * @memberOf BER
 * @desc Does the combat!
 */
class berSimulationController {
  constructor($scope,fleets,simulator,stateService) {
    this.$scope = $scope;
    this.fleets = fleets;
    this.simulator = simulator;
    this.stateService = stateService;
    this.ui = {};

    this.state = {};
    this.state.realm = "ber";
    this.state.key = "simulation";
  }

  $onInit() {
    // Check the stateService to see if there is information stored.
    if(this.stateService.hasState(this.state.realm,this.state.key)) {
      // Yes, import the existing state data
      console.info(`Something should have imported here!`)
      let savedState = this.stateService.getState(this.state.realm,this.state.key);
      this.simulator.loadState(savedState.simulator);
      this.attackers = savedState.attackers;
      this.defenders = savedState.defenders;
      this.events = savedState.events;
      this.ui = savedState.ui;
      this.simulation = this.simulator.saveState();
    }
    else {
      // No existing state, initialize to a new simulation.
      this.attackers = this.fleets.getAttackers();
      this.defenders = this.fleets.getDefenders();
      this.events = [];
      this.ui.output = false;
      this.ui.sim = false;
      this.ui.turns = [false,false,false,false,false];
      this.ui.lastState = false;
      this.ui.maxTurns = 20;
      this.ui.currentPage = 1;
    }
  }

  saveState() {
    let savedState = {};
    savedState.simulator = this.simulator.saveState();
    savedState.ui = this.ui;
    savedState.attackers = this.attackers;
    savedState.defenders = this.defenders;
    savedState.events = this.events;
    this.stateService.setState(this.state.realm,this.state.key,savedState);
  }

  setup() {
    this.simulator.setup(this.attackers,this.defenders,{baseToHit:50,turns:this.ui.maxTurns});
    this.saveState();
  }

  round() {
    this.simulation = this.simulator.singleRound();
    this.lastState = _.last(this.simulation.turns);
    this.ui.currentTurn = _.last(this.simulation.turns);
    console.log(this.simulation);
    this.saveState();
  }

  run() {
    this.simulation = this.simulator.fight();
    this.lastState = this.simulation.state;
    this.ui.currentTurn = _.last(this.simulation.turns);
    this.ui.currentPage = this.ui.maxTurns;
    this.saveState();
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

berSimulationController.$inject = ["$scope","berFleets","berSimulator","berState"];

export const berSimulation = {
  bindings: {},
  controller: berSimulationController,
  template: require('./berSimulation.component.html')
};
