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
  }

  goBack() {
    this.$state.go('^');
  }
}

berSimulatorViewController.$inject = ["$scope","berArchive","$state"];

export const berSimulatorView = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulatorViewController,
  template: require('./berSimulatorView.component.html')
};
