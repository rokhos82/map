/**
* @memberOf main
*/
class componentBuilderNewController {
  constructor($scope,componentLibrary) {
    this.$scope = $scope;
    this.library = componentLibrary;
    this.component = {};
  }

  createComponent() {
    this.library.setComponent(this.component.id,this.component);
  }
}

componentBuilderNewController.$inject = ['$scope','componentLibrary'];

export const componentBuilderNew = {
  bindings: {},
  controller: componentBuilderNewController,
  template: require('./componentBuilderNew.component.html')
};
