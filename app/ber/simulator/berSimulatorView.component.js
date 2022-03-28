/**
 * @class BER.berSimulatorView
 * @memberOf BER
 * @desc
 */
class berSimulatorViewController {
  constructor($scope,archive,$state,$stateParams) {
    this.$scope = $scope;
    this.archive = archive;
    this.$state = $state;
    this.$params = $stateParams;
  }

  $onInit() {
    console.log("Initializing simulatorViewController");
    if(!this.simulation) {
      this.simulation = this.archive.getSimulation(this.$params.simUuid);
    }
  }

  goBack() {
    this.$state.go('^');
  }
}

berSimulatorViewController.$inject = ["$scope","berArchive","$state","$stateParams"];

export const berSimulatorView = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulatorViewController,
  template: require('./berSimulatorView.component.html')
};
