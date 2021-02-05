/**
 * @class mobius-dev.unitBuilder
 * @memberOf mobius-dev
 * @desc A basic unit builder
 */
class unitBuilderRootController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

unitBuilderRootController.$inject = ["$scope"];

export const unitBuilderRoot = {
  bindings: {},
  controller: unitBuilderRootController,
  template: require('./unitBuilderRoot.component.html')
};
