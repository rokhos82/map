/**
 * @class modius-ber.berWelcome
 * @memberOf modius-ber
 * @desc
 */
class berWelcomeController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

berWelcomeController.$inject = ["$scope"];

export const berWelcome = {
  bindings: {},
  controller: berWelcomeController,
  template: require('./berWelcome.component.html')
};
