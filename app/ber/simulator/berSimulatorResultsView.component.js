/**
 * @class BER.berSimulatorResultsView
 * @memberOf BER
 * @desc Show the results of a simulation to the end user
 */
class berSimulatorResultsViewController {
  constructor($scope,$state,archive,$stateParams) {
    this.$scope = $scope;
    this.archive = archive;
    this.$params = $stateParams;
    this.$state = $state;
  }

  $onInit() {
    if(!this.simulation) {
      this.simulation = this.archive.getSimulation(this.$params.simUuid);
    }
  }
}

berSimulatorResultsViewController.$inject = ["$scope","$state","berArchive","$stateParams"];

export const berSimulatorResultsView = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulatorResultsViewController,
  template: require('./berSimulatorResultsView.component.html')
};
