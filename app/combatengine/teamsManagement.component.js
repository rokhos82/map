/**
* @memberOf mobius-engine
*/
class teamsManagementController {
 constructor($scope,$state,$transitions) {
   this.$scope = $scope;
   this.$state = $state;
   this.$transitions = $transitions;
 }
}

teamsManagementController.$inject = ['$scope','$state','$transitions'];

export const teamsManagement = {
 controller: teamsManagementController,
 template: require('./teamsManagement.component.html')
};
