/**
* @memberOf main
*/
class unitBuilderListController {
 constructor($scope,$state,$transitions) {
   this.$scope = $scope;
   this.$state = $state;
   this.$transitions = $transitions;
 }
}

unitBuilderListController.$inject = ['$scope','$state','$transitions'];

export const unitBuilderList = {
 controller: unitBuilderListController,
 template: require('./unitBuilderList.component.html')
};
