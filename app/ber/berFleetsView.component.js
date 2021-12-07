/**
 * @class BER.fleetsView
 * @memberOf BER
 * @desc Fleets overview
 */
class berFleetsViewController {
  constructor($scope,fleetService) {
    this.$scope = $scope;
    this.fleetService = fleetService;
    this.fleets = fleetService.listFleets();
  }

  $onInit() {
    this.attackers = this.fleetService.getAttackers();
    this.defenders = this.fleetService.getDefenders();
  }

  getTagString(unit) {
    let tagString = "";

    _.forEach(unit.tags,(value,tag) => {
      if(tag !== "brackets" && tag !== "flags" && tag !== "scan" && tag !== "hull" && !!value) {
        tagString += `${tag} ${value} `;
      }
    });

    return tagString;
  }

  getAttackString(unit) {
    let attackString = "";

    _.forEach(unit.tags.brackets,(value) => {
      attackString += `${value.tag}`;
    });

    return attackString;
  }
}

berFleetsViewController.$inject = ["$scope","berFleets"];

export const berFleetsView = {
  bindings: {},
  controller: berFleetsViewController,
  template: require('./berFleetsView.component.html')
};
