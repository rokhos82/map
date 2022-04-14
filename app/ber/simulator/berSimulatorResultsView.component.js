/**
 * @class BER.berSimulatorResultsView
 * @memberOf BER
 * @desc Show the results of a simulation to the end user
 */
class berSimulatorResultsViewController {
  constructor($scope,$state,archive,$stateParams,unit) {
    this.$scope = $scope;
    this.archive = archive;
    this.$params = $stateParams;
    this.$state = $state;
    this.unit = unit;

    this.ui = {};
    this.ui.search = {};
    this.ui.turns = {};
  }

  $onInit() {
    this.ui.debug = false;
    if(!this.simulation) {
      this.simulation = this.archive.getSimulation(this.$params.simUuid);
    }
  }

  toggleDebug() {
    this.ui.debug = !this.ui.debug;
  }

  toggleEvents(index) {
    this.ui.turns[index] = !this.ui.turns[index];
  }
}

berSimulatorResultsViewController.$inject = ["$scope","$state","berArchive","$stateParams","berUnit"];

export const berSimulatorResultsView = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulatorResultsViewController,
  template: require('./berSimulatorResultsView.component.html')
};
