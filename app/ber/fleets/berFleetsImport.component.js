/**
 * @class BER.berFleetsImport
 * @memberOf BER
 * @desc Imports fleet files
 */

import {fleetPresets,fleetPresetsMap} from "./fleetPresets.js";

class berFleetsImportController {
  constructor($scope,archive,parser,$state) {
    this.$scope = $scope;
    this.archive = archive;
    this.parser = parser;
    this.$state = $state;

    this.prebuiltFleetsList = fleetPresetsMap;
    this.prebuiltFleets = fleetPresets;
  }

  $onInit() {}

  importFleet() {
    // Parse the fleet file
    let fleetFile = this.parser.parseFleet(this.fleetFile);
    this.archive.setFleet(fleetFile.uuid,fleetFile);
    this.archive.serializeFleets();
    this.fleetFile = "";
  }

  importFleetAndGo() {
    this.importFleet();
    this.$state.go("^.list");
  }

  loadFleet(key) {
    this.fleetFile = this.prebuiltFleets[key];
  }
}

berFleetsImportController.$inject = ["$scope","berArchive","berParser","$state"];

export const berFleetsImport = {
  bindings: {},
  controller: berFleetsImportController,
  template: require('./berFleetsImport.component.html')
};
