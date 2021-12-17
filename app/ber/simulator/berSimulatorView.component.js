/**
 * @class BER.berSimulatorView
 * @memberOf BER
 * @desc
 */
class berSimulatorViewController {
  constructor($scope,archive) {
    this.$scope = $scope;
    this.archive = archive;
  }

  $onInit() {
    this.simulations = this.archive.listSimulations();
  }
}

berSimulatorViewController.$inject = ["$scope","berArchive"];

export const berSimulatorView = {
  bindings: {},
  controller: berSimulatorViewController,
  template: require('./berSimulatorView.component.html')
};
