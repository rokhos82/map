/**
* @memberOf main
*/
class unitBuilderEditController {
 constructor($scope,$state,unitLibrary,engineService) {
   this.$scope = $scope;
   this.$state = $state;
   this.library = unitLibrary;
   this.engineService = engineService;

   this.compiledUnit = {};
 }

 $onInit() {}

 compile() {
   this.compiledUnit = this.engineService.compileUnit(this.unit);
 }
}

unitBuilderEditController.$inject = ['$scope','$state',"mobius-core-unit-library","mobius-engine-service"];

export const unitBuilderEdit = {
  bindings: {
    unit: "<"
  },
  controller: unitBuilderEditController,
  template: require('./unitBuilderEdit.component.html')
};
