/**
 * @class mobius-dev.componentBuilderEdit
 * @memberOf mobius-dev
 * @desc The edit view of the component model 
 */
class componentBuilderEditController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

componentBuilderEditController.$inject = ["$scope"];

export const componentBuilderEdit = {
  bindings: {},
  controller: componentBuilderEditController,
  template: require('./componentBuilderEdit.component.html')
};
