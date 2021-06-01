/**
 * @class BER.fleetsView
 * @memberOf BER
 * @desc Fleets overview
 */
class berFleetsViewController {
  constructor($scope,fleets) {
    this.$scope = $scope;
    this.fleets = fleets;
  }

  $onInit() {
    this.attackers = this.fleets.getAttackers();
    this.defenders = this.fleets.getDefenders();
  }
}

berFleetsViewController.$inject = ["$scope","berFleets"];

export const berFleetsView = {
  bindings: {},
  controller: berFleetsViewController,
  template: require('./berFleetsView.component.html')
};
