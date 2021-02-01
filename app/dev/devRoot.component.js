/**
 * @class MAP-ENGINE.devRoot
 * @memberOf MAP-ENGINE
 * @desc The root of the dev module
 */
class devRootController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

devRootController.$inject = ["$scope"];

export const devRoot = {
  bindings: {},
  controller: devRootController,
  template: require('./devRoot.component.html')
};
