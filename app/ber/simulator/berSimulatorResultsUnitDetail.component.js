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
    let unit = this.simulation.units[this.unitUuid];
    this.unit = unit;

    let events = [];
    _.forEach(this.simulation.turns,(turn) => {
      let e = _.filter(turn.events,(event) => {
        let res = null;
        if(event.actorId == unit.uuid || event.acteeId === unit.uuid) {
          res = event;
        }
        return res;
      });
      events.push(e);
    });

    console.info(events);

    this.events = _.flattenDeep(events);
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
