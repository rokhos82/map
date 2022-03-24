/**
 * @class BER.berFleetList
 * @memberOf BER
 * @desc
 */
class berFleetListController {
  constructor($scope,$state,archive,$window) {
    this.$scope = $scope;
    this.$state = $state;
    this.archive = archive;
    this.$window = $window;

    this.ui = {};
    this.ui.fleets = {};
    this.ui.messages = [];
    this.ui.selectAll = false;
  }

  $onInit() {
    this.fleets = this.archive.listFleets();
  }

  toggleSelectAll() {
    _.forEach(this.fleets,(simulation,key) => {
      this.ui.fleets[key] = this.ui.selectAll;
    });
  }

  toggleFleetCheck() {
    this.ui.selectAll = false;
  }

  deleteSelected() {
    let work = false;

    // Confirm with the user that they want to proceed with the deletions
    if(this.$window.confirm("Do you really want to delete the selected fleets?")) {
      // Walk through the fleets to see which ones are selected
      _.forEach(this.ui.fleets,(deleteFleet,key) => {
        // Is this fleet selected?
        if(deleteFleet) {
          // Remove the fleet from the list
          this.archive.deleteFleet(key);
          work = true;
        }
      });
    }

    if(work) {
      // Serialize the fleets to localStorage
      this.archive.serializeFleets();

      // Refresh the current state
      this.$state.reload();
    }
  }

  goToFleet(uuid) {
    this.$state.go('^.detail',{uuid: uuid});
  }
}

berFleetListController.$inject = ["$scope","$state","berArchive","$window"];

export const berFleetList = {
  bindings: {},
  controller: berFleetListController,
  template: require('./berFleetList.component.html')
};
