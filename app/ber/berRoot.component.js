/**
 * @class BER.berRoot
 * @memberOf BER
 * @desc Root of the BattleEngine Reborn module
 */
class berRootController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

berRootController.$inject = ["$scope"];

export const berRoot = {
  bindings: {},
  controller: berRootController,
  template: require('./berRoot.component.html')
};
