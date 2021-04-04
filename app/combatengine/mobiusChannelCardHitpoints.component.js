/**
* @memberOf main
*/
class mobiusChannelCardHitpointsController {
 constructor($scope,$state,$transitions) {
   this.$scope = $scope;
   this.$state = $state;
   this.$transitions = $transitions;
 }
}

mobiusChannelCardHitpointsController.$inject = ['$scope','$state','$transitions'];

export const mobiusChannelCardHitpoints = {
  bindings: {
    info: "<",
    title: "<"
  },
  controller: mobiusChannelCardHitpointsController,
  template: require('./mobiusChannelCardHitpoints.component.html')
};
