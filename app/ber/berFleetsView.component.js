/**
 * @class BER.fleetsView
 * @memberOf BER
 * @desc Fleets overview
 */
class berFleetsViewController {
  constructor($scope,archive) {
    this.$scope = $scope;
    this.archive = archive;
    this.fleets = archive.listFleets();
  }

  $onInit() {
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

berFleetsViewController.$inject = ["$scope","berArchive"];

export const berFleetsView = {
  bindings: {},
  controller: berFleetsViewController,
  template: require('./berFleetsView.component.html')
};
