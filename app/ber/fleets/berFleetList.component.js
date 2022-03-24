/**
 * @class BER.berFleetList
 * @memberOf BER
 * @desc
 */
class berFleetListController {
  constructor($scope,$state,archive) {
    this.$scope = $scope;
    this.$state = $state;
    this.archive = archive;
  }

  $onInit() {
    this.fleets = this.archive.listFleets();
  }
}

berFleetListController.$inject = ["$scope","$state","berArchive"];

export const berFleetList = {
  bindings: {},
  controller: berFleetListController,
  template: require('./berFleetList.component.html')
};
