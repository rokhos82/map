/**
 * @class mobius-engine.engineWelcome
 * @memberOf mobius-engine
 * @desc Welcome landing page component for the Combat Engine
 */
class engineWelcomeController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

engineWelcomeController.$inject = ["$scope"];

export const engineWelcome = {
  bindings: {},
  controller: engineWelcomeController,
  template: require('./engineWelcome.component.html')
};
