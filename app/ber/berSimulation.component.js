/**
 * @class BER.berSimulation
 * @memberOf BER
 * @desc Does the combat!
 */
class berSimulationController {
  constructor($scope,archive,uuid) {
    this.$scope = $scope;
    this.archive = archive;
    this.uuid = uuid;

    this.ui = {};
    this.simulations = {};
    this.fleets = {};

    this.state = {};
    this.state.realm = "ber";
    this.state.key = "simulation";
  }

  $onInit() {
    // Get the loaded fleets
    this.fleets = this.archive.listFleets();
    this.simulations = this.archive.listSimulations();
    this.ui.maxTurns = 100;
  }

  $onDestroy() {
    //this.saveState();
  }

  saveState() {
    /*let savedState = {};
    savedState.simulator = this.simulator.saveState();
    savedState.ui = this.ui;
    savedState.attackers = this.attackers;
    savedState.defenders = this.defenders;
    savedState.events = this.events;
    this.stateService.setState(this.state.realm,this.state.key,savedState);//*/
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

    this.archive.setSimulation(sim.uuid,sim);
    this.archive.serializeSimulations();
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
}

berSimulationController.$inject = ["$scope","berArchive","mobius-core-uuid"];

export const berSimulation = {
  bindings: {},
  controller: berSimulationController,
  template: require('./berSimulation.component.html')
};
