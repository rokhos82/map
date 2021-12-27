/**
 * @class BER.berFleetInfoList
 * @memberOf BER
 * @desc
 */
class berFleetInfoListController {
  constructor($scope,$state) {
    this.$scope = $scope;
    this.$state = $state;
  }

  $onInit() {
    console.info(this.fleets);
  }

  goFleetDetail(fleetUuid) {
    console.info(fleetUuid);
    this.$state.go('.detail',{uuid:fleetUuid});
  }
}

berFleetInfoListController.$inject = ["$scope","$state"];

export const berFleetInfoList = {
  bindings: {
    fleets: "<"
  },
  controller: berFleetInfoListController,
  template: require('./berFleetInfoList.component.html')
};
