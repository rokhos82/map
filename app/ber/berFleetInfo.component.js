/**
 * @class BER.berFleetInfo
 * @memberOf BER
 * @desc Detailed information about a fleet
 */
class berFleetInfoController {
  constructor($scope,unit) {
    this.$scope = $scope;
    this.unit = unit;
  }

  $onInit() {
    console.info(this);
  }
}

berFleetInfoController.$inject = ["$scope","berUnit"];

export const berFleetInfo = {
  bindings: {
    fleet: "<",
    markup: "@"
  },
  controller: berFleetInfoController,
  template: require('./berFleetInfo.component.html')
};
