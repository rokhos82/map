/**
* @memberOf mobius-main
*/
class appController {
 constructor($scope,$state,$transitions) {
   this.$scope = $scope;
   this.$state = $state;
   this.$transitions = $transitions;
 }
}

appController.$inject = ['$scope','$state','$transitions'];

export const app = {
 controller: appController,
 template: require('./app.component.html')
};
