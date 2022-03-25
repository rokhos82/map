/**
 * @class BER.berSimulatorView
 * @memberOf BER
 * @desc
 */
class berSimulatorViewController {
  constructor($scope,archive,$state) {
    this.$scope = $scope;
    this.archive = archive;
    this.$state = $state;
  }

  $onInit() {
    if(!this.simulation) {
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
