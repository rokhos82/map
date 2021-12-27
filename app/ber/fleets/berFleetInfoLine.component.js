/**
 * @class BER.berFleetInfoLine
 * @memberOf BER
 * @desc
 */
class berFleetInfoLineController {
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    console.info(this.fleet);
  }
}

berFleetInfoLineController.$inject = ["$scope"];

export const berFleetInfoLine = {
  bindings: {
    fleet: "<"
  },
  controller: berFleetInfoLineController,
  template: require('./berFleetInfoLine.component.html')
};
