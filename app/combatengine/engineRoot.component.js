/**
 * @memberof mobius-engine
 */
class engineRootController {
  constructor($scope,$state,$transitions) {}
}

engineRootController.$inject = ['$scope','$state','$transitions'];

export const engineRoot = {
  controller: engineRootController,
  template: require('./engineRoot.component.html')
};
