/**
* @memberOf main
*/
class unitBuilderListController {
  constructor($scope,$state,unitLibrary) {
    this.$scope = $scope;
    this.$state = $state;
    this.library = unitLibrary;
  }

  $onInit() {
    this.list = this.library.listUnits();
  }
}

unitBuilderListController.$inject = ["$scope","$state","mobius-core-unit-library"];

export const unitBuilderList = {
  bindings: {},
  controller: unitBuilderListController,
  template: require("./unitBuilderList.component.html")
};
