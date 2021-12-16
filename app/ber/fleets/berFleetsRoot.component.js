/**
 * @class BER.berFleetsRoot
 * @memberOf BER
 * @desc The root component for the fleets view tree
 */
class berFleetsRootController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

berFleetsRootController.$inject = ["$scope"];

export const berFleetsRoot = {
  bindings: {},
  controller: berFleetsRootController,
  template: require('./berFleetsRoot.component.html')
};
