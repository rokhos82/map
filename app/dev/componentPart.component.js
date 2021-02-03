/**
 * @class mobius-dev.componentPart
 * @memberOf mobius-dev
 * @desc Part of a nested component
 */
class componentPartController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

componentPartController.$inject = ["$scope"];

export const componentPart = {
  bindings: {
    part: "<",
    name: "<"
  },
  controller: componentPartController,
  template: require('./componentPart.component.html')
};
