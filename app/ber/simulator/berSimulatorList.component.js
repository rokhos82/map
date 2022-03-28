/**
 * @class BER.berSimulatorList
 * @memberOf BER
 * @desc Lists all of the simulations registered
 */
class berSimulatorListController {
  constructor($scope,archive,$state,$window) {
    this.$scope = $scope;
    this.archive = archive;
    this.$state = $state;
    this.$window = $window;

    this.ui = {};
    this.ui.simulations = {};
    this.ui.selectAll = false;
  }

  $onInit() {
    this.simulations = this.archive.listSimulations();
  }

  toggleSelectAll() {
    _.forEach(this.simulations,(simulation,key) => {
      this.ui.simulations[key] = this.ui.selectAll;
    });
  }

  toggleSimulationCheck() {
    this.ui.selectAll = false;
  }

  deleteSelected() {
    let work = false;

    // Confirm with the user that they want to proceed with the deletions
    if(this.$window.confirm("Do you really want to delete the selected simulations?")) {
      _.forEach(this.ui.simulations,(deleteSim,key) => {
        if(deleteSim) {
          // Remove the simulation from the list.
          this.archive.deleteSimulation(key);
          work = true;
        }
      });
    }

    // Did any work get done?
    if(work) {
      // Serialize the simulations to localStorage
      this.archive.serializeSimulations();

      // Refresh the current state.
      this.$state.reload();
    }
  }

  goToSimulation(uuid) {
    this.$state.go('^.view',{simUuid: uuid});
  }
}

berSimulatorListController.$inject = ["$scope","berArchive","$state","$window"];

export const berSimulatorList = {
  bindings: {},
  controller: berSimulatorListController,
  template: require('./berSimulatorList.component.html')
};
