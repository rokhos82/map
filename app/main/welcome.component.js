/**
* @memberOf mobius-main
*/
class welcomeController {
 constructor($scope,$state,$transitions) {
   this.$scope = $scope;
   this.$state = $state;
   this.$transitions = $transitions;
 }
}

welcomeController.$inject = ['$scope','$state','$transitions'];

export const welcome = {
 controller: welcomeController,
 template: require('./welcome.component.html')
};
