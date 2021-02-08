/**
* @memberOf main
*/
class unitBuilderEditController {
 constructor($scope,$state) {
   this.$scope = $scope;
   this.$state = $state;
 }
}

unitBuilderEditController.$inject = ['$scope','$state'];

export const unitBuilderEdit = {
controller: unitBuilderEditController,
 template: require('./unitBuilderEdit.component.html')
};
