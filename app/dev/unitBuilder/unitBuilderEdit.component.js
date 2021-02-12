/**
* @memberOf main
*/
class unitBuilderEditController {
 constructor($scope,$state,unitLibrary) {
   this.$scope = $scope;
   this.$state = $state;
   this.library = unitLibrary;
 }

 $onInit() {}
}

unitBuilderEditController.$inject = ['$scope','$state',"mobius-core-unit-library"];

export const unitBuilderEdit = {
  bindings: {
    unit: "<"
  },
  controller: unitBuilderEditController,
  template: require('./unitBuilderEdit.component.html')
};
