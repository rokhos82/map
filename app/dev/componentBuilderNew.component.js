/**
* @memberOf main
*/
class componentBuilderNewController {
  constructor($scope,componentLibrary,$state) {
    this.$scope = $scope;
    this.library = componentLibrary;
    this.$state = $state;
    this.component = {};
  }

  createComponent() {
    this.library.setComponent(this.component.id,this.component);
    this.$state.go("devComponentBuilderEdit",{
      componentId: this.component.id
    });
  }
}

componentBuilderNewController.$inject = ['$scope','componentLibrary',"$state"];

export const componentBuilderNew = {
  bindings: {},
  controller: componentBuilderNewController,
  template: require('./componentBuilderNew.component.html')
};
