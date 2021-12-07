/**
 * @class BER.berFleetCard
 * @memberOf BER
 * @desc Detailed information about a fleet
 */
class berFleetCardController {
  constructor($scope,unit,$state) {
    this.$scope = $scope;
    this.unit = unit;
    this.$state = $state;
  }

  $onInit() {
  }

  goDetails() {
    $state.go('berFleetsViewDetail',{uuid:this.fleet.uuid});
  }
}

berFleetCardController.$inject = ["$scope","berUnit","$state"];

export const berFleetCard = {
  bindings: {
    fleet: "<"
  },
  controller: berFleetCardController,
  template: require('./berFleetCard.component.html')
};
