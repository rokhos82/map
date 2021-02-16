/**
* @memberOf main
*/
class techBuilderListController {
  constructor($scope,$state,$transitions,techLibrary) {
    this.$scope = $scope;
    this.$state = $state;
    this.$transitions = $transitions;
    this.library = techLibrary;
  }

  $OnInit() {
    this.list = this.library.listTechs();
  }
}

techBuilderListController.$inject = ['$scope','$state','$transitions',"mobius-core-tech-library"];

export const techBuilderList = {
  bindings: {},
  controller: techBuilderListController,
  template: require('./techBuilderList.component.html')
};
