/**
 * @class BER.berResultView
 * @memberOf BER
 * @desc
 */
class berResultViewController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

berResultViewController.$inject = ["$scope"];

export const berResultView = {
  bindings: {},
  controller: berResultViewController,
  template: require('./berResultView.component.html')
};
