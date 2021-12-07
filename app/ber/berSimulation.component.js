/**
 * @class BER.berSimulation
 * @memberOf BER
 * @desc Does the combat!
 */
class berSimulationController {
  constructor($scope,fleetService,simulator,stateService,unit,uuid) {
    this.$scope = $scope;
    this.fleetService = fleetService;
    this.simulator = simulator;
    this.stateService = stateService;
    this.unit = unit;
    this.uuid = uuid;

    this.ui = {};
    this.simulations = {};

    this.state = {};
    this.state.realm = "ber";
    this.state.key = "simulation";
  }

  $onInit() {
    // Get the loaded fleets
    this.fleets = this.fleetService.listFleets();

    // Check the stateService to see if there is information stored.
    if(this.stateService.hasState(this.state.realm,this.state.key)) {
      // Yes, import the existing state data
      console.info(`Something should have imported here!`)
      let savedState = this.stateService.getState(this.state.realm,this.state.key);
      this.simulator.loadState(savedState.simulator);
      this.events = savedState.events;
      console.log(this.ui,savedState.ui);
      _.merge(this.ui,savedState.ui);
      this.simulation = this.simulator.saveState();
    }
    else {
      // No existing state, initialize to a new simulation.
      this.events = [];
      this.ui.output = false;
      this.ui.sim = false;
      this.ui.turns = [false,false,false,false,false];
      this.ui.lastState = false;
      this.ui.maxTurns = 20;
      this.ui.currentPage = 0;
    }
  }

  $onDestroy() {
    this.saveState();
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
    // This adds the simulation to an hash of simulations so that the user can setup multiple simulations.
    let sim = {};
    sim.name = this.ui.simulationName;
    sim.uuid = this.uuid.v4();
    sim.maxTurns = this.ui.maxTurns;
    sim.attacker = this.ui.attacker;
    sim.defender = this.ui.defender;
    sim.status = "Pending";

    this.simulations[sim.uuid] = sim;

    console.info(this.simulations);

    //this.simulator.setup(this.attackers,this.defenders,{baseToHit:50,turns:this.ui.maxTurns});
    //this.saveState();
  }

  round() {
    this.simulation = this.simulator.singleRound();
    this.lastState = _.last(this.simulation.turns);
    this.ui.currentTurn = _.last(this.simulation.turns);
    this.ui.currentPage++;
    console.log(this.simulation);
    this.saveState();
  }

  run() {
    this.simulation = this.simulator.fight();
    this.lastState = this.simulation.state;
    this.ui.currentTurn = _.last(this.simulation.turns);
    this.ui.currentPage = this.ui.currentTurn.turn;
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

  getFleet(uuid) {
    return this.fleetService.getFleet(uuid);
  }
}

berSimulationController.$inject = ["$scope","berFleets","berSimulator","berState","berUnit","mobius-core-uuid"];

export const berSimulation = {
  bindings: {},
  controller: berSimulationController,
  template: require('./berSimulation.component.html')
};
