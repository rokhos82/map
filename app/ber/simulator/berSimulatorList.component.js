/**
 * @class BER.berSimulatorList
 * @memberOf BER
 * @desc Lists all of the simulations registered
 */
class berSimulatorListController {
  constructor($scope,archive,$state) {
    this.$scope = $scope;
    this.archive = archive;
    this.$state = $state;

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
    _.forEach(this.ui.simulations,(deleteSim,key) => {
      if(deleteSim) {
        // Remove the simulation from the list.
        this.archive.deleteSimulation(key);
        work = true;
      }
    });

    // Did any work get done?
    if(work) {
      // Serialize the simulations to localStorage
      this.archive.serializeSimulations();

      // Refresh the current state.
      this.$state.reload();
    }
  }
}

berSimulatorListController.$inject = ["$scope","berArchive","$state"];

export const berSimulatorList = {
  bindings: {},
  controller: berSimulatorListController,
  template: require('./berSimulatorList.component.html')
};
