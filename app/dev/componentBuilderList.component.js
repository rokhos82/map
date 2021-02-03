/**
 * @class mobius-dev.componentBuilderList
 * @memberOf mobius-dev
 * @desc List view for the component builder
 */
class componentBuilderListController {
  constructor($scope,componentLibrary) {
    this.$scope = $scope;
    this.library = componentLibrary;
  }

  $onInit() {
    this.list = this.library.listComponents();
    this.selectedComponent = "";
  }
}

componentBuilderListController.$inject = ["$scope","componentLibrary"];

export const componentBuilderList = {
  bindings: {},
  controller: componentBuilderListController,
  template: require('./componentBuilderList.component.html')
};
