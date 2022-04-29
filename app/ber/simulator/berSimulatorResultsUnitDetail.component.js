/**
 * @class BER.berSimulatorResultsUnitDetail
 * @memberOf BER
 * @desc Provides details from the simulation specific to a single unit
 */
class berSimulatorResultsUnitDetailController {
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    console.info(this.simulation);
    console.info(this.unitUuid);
  }
}

berSimulatorResultsUnitDetailController.$inject = ["$scope"];

export const berSimulatorResultsUnitDetail = {
  bindings: {
    simulation: "<",
    unitUuid: "<"
  },
  controller: berSimulatorResultsUnitDetailController,
  template: require('./berSimulatorResultsUnitDetail.component.html')
};
