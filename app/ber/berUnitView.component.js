/**
 * @class BER.berUnitView
 * @memberOf BER
 * @desc The Unit Line for a table
 */
class berUnitViewController {
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {}
}

berUnitViewController.$inject = ["$scope"];

export const berUnitView = {
  bindings: {},
  controller: berUnitViewController,
  template: require('./berUnitView.component.html')
};
