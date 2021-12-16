/**
 * @class BER.fleetsView
 * @memberOf BER
 * @desc Fleets overview
 */
class berFleetsViewController {
  constructor($scope,archive) {
    this.$scope = $scope;
    this.archive = archive;
  }

  $onInit() {
    this.fleets = this.archive.listFleets();
  }
}

berFleetsViewController.$inject = ["$scope","berArchive"];

export const berFleetsView = {
  bindings: {},
  controller: berFleetsViewController,
  template: require('./berFleetsView.component.html')
};
