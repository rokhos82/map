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
}

berFleetInfoController.$inject = ["$scope","berUnit"];

export const berFleetInfo = {
  bindings: {
    fleet: "<"
  },
  controller: berFleetInfoController,
  template: require('./berFleetInfo.component.html')
};
