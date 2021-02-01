/**
 * @class mobius-dev.componentBuilder
 * @memberOf mobius-dev
 * @desc A dev tool for building components for unit definitions
 */
class componentBuilderController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

componentBuilderController.$inject = ["$scope"];

export const componentBuilder = {
  bindings: {},
  controller: componentBuilderController,
  template: require('./componentBuilder.component.html')
};
