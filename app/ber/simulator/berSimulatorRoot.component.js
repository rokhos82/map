/**
 * @class BER.berSimulatorRoot
 * @memberOf BER
 * @desc
 */
class berSimulatorRootController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

berSimulatorRootController.$inject = ["$scope"];

export const berSimulatorRoot = {
  bindings: {},
  controller: berSimulatorRootController,
  template: require('./berSimulatorRoot.component.html')
};
