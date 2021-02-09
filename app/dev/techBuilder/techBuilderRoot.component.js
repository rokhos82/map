/**
* @memberOf main
*/
class techBuilderRootController {
 constructor($scope,$state,$transitions) {
   this.$scope = $scope;
   this.$state = $state;
   this.$transitions = $transitions;
 }
}

techBuilderRootController.$inject = ['$scope','$state','$transitions'];

export const techBuilderRoot = {
 controller: techBuilderRootController,
 template: require('./techBuilderRoot.component.html')
};
