/**
* @memberOf main
*/
class mobiusUnitCardController {
 constructor($scope,$state,$transitions) {
   this.$scope = $scope;
   this.$state = $state;
   this.$transitions = $transitions;
 }
}

mobiusUnitCardController.$inject = ['$scope','$state','$transitions'];

export const mobiusUnitCard = {
  bindings: {
    unit: "<"
  },
  controller: mobiusUnitCardController,
  template: require('./mobiusUnitCard.component.html')
};
