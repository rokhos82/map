/**
 * @class mobius-dev.unitBuilder
 * @memberOf mobius-dev
 * @desc A basic unit builder
 */
class unitBuilderController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

unitBuilderController.$inject = ["$scope"];

export const unitBuilder = {
  bindings: {},
  controller: unitBuilderController,
  template: require('./unitBuilder.component.html')
};
