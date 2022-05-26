/**
 * @class BER.berSimulatorResultsExportTxt
 * @memberOf BER
 * @desc Exports results as simple text
 */
class berSimulatorResultsExportTxtController {
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {}
}

berSimulatorResultsExportTxtController.$inject = ["$scope"];

export const berSimulatorResultsExportTxt = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulatorResultsExportTxtController,
  template: require('./berSimulatorResultsExportTxt.component.html')
};
