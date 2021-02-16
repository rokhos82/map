/**
* @memberOf main
*/
class techBuilderEditController {
  constructor($scope,$state,$transitions) {
    this.$scope = $scope;
    this.$state = $state;
    this.$transitions = $transitions;
  }
}

techBuilderEditController.$inject = ['$scope','$state','$transitions'];

export const techBuilderEdit = {
  bindings: {},
  controller: techBuilderEditController,
  template: require('./techBuilderEdit.component.html')
};
