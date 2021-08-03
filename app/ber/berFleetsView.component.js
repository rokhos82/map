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

  getTagString(unit) {
    let tagString = "";

    _.forEach(unit.tags,(value,tag) => {
      if(tag !== "brackets" && tag !== "flags" && !!value) {
        tagString += `${tag} ${value} `;
      }
    });

    return tagString;
  }
}

berFleetsViewController.$inject = ["$scope","berFleets"];

export const berFleetsView = {
  bindings: {},
  controller: berFleetsViewController,
  template: require('./berFleetsView.component.html')
};
