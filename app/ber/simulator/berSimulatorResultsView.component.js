/**
 * @class BER.berSimulatorResultsView
 * @memberOf BER
 * @desc Show the results of a simulation to the end user
 */
class berSimulatorResultsViewController {
  constructor($scope,$state,archive) {
    this.$scope = $scope;
  }

  $onInit() {
    console.log(this.simulation);
  }
}

berSimulatorResultsViewController.$inject = ["$scope","$state","berArchive"];

export const berSimulatorResultsView = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulatorResultsViewController,
  template: require('./berSimulatorResultsView.component.html')
};
