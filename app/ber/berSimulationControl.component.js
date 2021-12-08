/**
 * @class BER.simulationControl
 * @memberOf BER
 * @desc This is a component to control a specific simulation instance.
 */
class berSimulationControlController {
  constructor($scope,fleetService) {
    this.$scope = $scope;
    this.fleetService = fleetService;
  }

  getFleet(uuid) {
    return this.fleetService.getFleet(uuid);
  }
}

berSimulationControlController.$inject = ["$scope","berFleets"];

export const berSimulationControl = {
  bindings: {
    simulation: "<"
  },
  controller: berSimulationControlController,
  template: require('./berSimulationControl.component.html')
};
