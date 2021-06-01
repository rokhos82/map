/**
 * @class mobius-ber.berImport
 * @memberOf mobius-ber
 * @desc Import fleets for the BER.
 */
class berImportController {
  constructor($scope,fleets,parser) {
    this.$scope = $scope;
    this.fleets = fleets;
    this.parser = parser;

    this.attackers = "";
    this.defenders = "";
  }

  $onInit() {}

  importFleets() {
    // Parse the attacking fleet
    this.fleets.setAttackers(this.parser.parseFleet(this.attackers));
    this.fleets.setDefenders(this.parser.parseFleet(this.defenders));
  }
}

berImportController.$inject = ["$scope","berFleets","berParser"];

export const berImport = {
  bindings: {},
  controller: berImportController,
  template: require('./berImport.component.html')
};
