/**
 * @class BER.berFleetDetail
 * @memberOf BER
 * @desc Detailed information about a fleet
 */
class berFleetDetailController {
  constructor($scope,unit,$state,fleetService) {
    this.$scope = $scope;
    this.unit = unit;
    this.$state = $state;
    this.fleetService = fleetService;
  }

  $onInit() {
  }

  goDetails() {}
}

berFleetDetailController.$inject = ["$scope","berUnit","$state","berFleets"];

export const berFleetDetail = {
  bindings: {
    fleet: "<"
  },
  controller: berFleetDetailController,
  template: require('./berFleetDetail.component.html')
};
