/**
 * @class BER.berRoot
 * @memberOf BER
 * @desc Root of the BattleEngine Reborn module
 */
class berRootController {
  constructor($scope,archive) {
    this.$scope = $scope;
    this.archive = archive;
  }

  $onInit() {
    console.info(`Entering BER`);
    this.archive.deserializeFleets();
    this.archive.deserializeSimulations();
  }

  $onDestroy() {
    console.info(`Leaving BER`);
    this.archive.serializeFleets();
    this.archive.serializeSimulations();
  }
}

berRootController.$inject = ["$scope","berArchive"];

export const berRoot = {
  bindings: {},
  controller: berRootController,
  template: require('./berRoot.component.html')
};
