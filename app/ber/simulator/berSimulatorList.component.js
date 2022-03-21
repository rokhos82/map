/**
 * @class BER.berSimulatorList
 * @memberOf BER
 * @desc Lists all of the simulations registered
 */
class berSimulatorListController {
  constructor($scope,archive) {
    this.$scope = $scope;
    this.archive = archive;
  }

  $onInit() {
    this.simulations = this.archive.listSimulations();
  }
}

berSimulatorListController.$inject = ["$scope","berArchive"];

export const berSimulatorList = {
  bindings: {},
  controller: berSimulatorListController,
  template: require('./berSimulatorList.component.html')
};
