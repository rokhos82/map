/**
 * @class BER.berFleetInfoList
 * @memberOf BER
 * @desc
 */
class berFleetInfoListController {
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    console.info(this.fleets);
  }
}

berFleetInfoListController.$inject = ["$scope"];

export const berFleetInfoList = {
  bindings: {
    fleets: "<"
  },
  controller: berFleetInfoListController,
  template: require('./berFleetInfoList.component.html')
};
