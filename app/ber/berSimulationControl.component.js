/**
 * @class BER.simulationControl
 * @memberOf BER
 * @desc This is a component to control a specific simulation instance.
 */
class berSimulationControlController {
  constructor($scope) {
    this.$scope = $scope;
  }
}

berSimulationControlController.$inject = ["$scope"];

export const berSimulationControl = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulationControlController,
  template: require('./berSimulationControl.component.html')
};
