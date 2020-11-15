/**
* @memberOf mobius-map
*/
class mapRootController {
 constructor($scope,$state,$transitions) {
   this.$scope = $scope;
   this.$state = $state;
   this.$transitions = $transitions;
 }
}

mapRootController.$inject = ['$scope','$state','$transitions'];

export const mapRoot = {
 controller: mapRootController,
 template: require('./mapRoot.component.html')
};
