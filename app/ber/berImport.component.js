/**
 * @class mobius-ber.berImport
 * @memberOf mobius-ber
 * @desc Import fleets for the BER.
 */
class berImportController {
  constructor($scope,fleets,parser) {
    this.$scope = $scope;
    this.fleets = fleets;
    this.parser = parser;

    this.attackers = `TEST,It Was Like That When We Go Here,50,7,126,0,0,0,,,,,
Ultimate Frigate 1,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50
Ultimate Frigate 2,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50
Ultimate Frigate 3,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50
Ultimate Frigate 4,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50
Ultimate Frigate 5,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50
Ultimate Frigate 6,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50
Ultimate Frigate 7,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50`;
    this.defenders = `TEST,Test Fleet Please Ignore,50,15,95,15,0,0,0,,,,
Cheap Screen Corvette 1,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90 DELAY 2
Cheap Screen Corvette 2,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90 DELAY 2
Cheap Screen Corvette 3,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90 DELAY 2
Cheap Screen Corvette 4,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90 DELAY 2
Cheap Screen Corvette 5,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90
Cheap Screen Corvette 6,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90
Cheap Screen Corvette 7,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90
Cheap Screen Corvette 8,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90
Cheap Screen Corvette 9,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90
Cheap Screen Corvette 10,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90
Cheap Screen Corvette 11,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90
Cheap Screen Corvette 12,1,1,5,5,0,0,5,5,0,0,0, DEFENSE 25 DAMAGE 90
Artillery Frigate 1,8,8,1,1,0,0,9,9,0,0,0,[8 target 90 artillery] RESERVE 99 DAMAGE 90 DELAY 2
Artillery Frigate 2,8,8,1,1,0,0,9,9,0,0,0,[8 target 90 artillery] RESERVE 80 DAMAGE 90 DELAY 2
Artillery Frigate 3,8,8,1,1,0,0,9,9,0,0,0,[8 target 90 artillery] RESERVE 60 DAMAGE 90
Artillery Frigate 4,8,8,1,1,0,0,9,9,0,0,0,[8 target 90 artillery] RESERVE 40 DAMAGE 90
Artillery Frigate 5,8,8,1,1,0,0,9,9,0,0,0,[8 target 90 artillery] RESERVE 20 DAMAGE 90
Artillery Frigate 6,8,8,1,1,0,0,9,9,0,0,0,[8 target 90 artillery] RESERVE 20 DAMAGE 90`;
  }

  $onInit() {}

  importFleets() {
    // Parse the attacking fleet
    this.fleets.setAttackers(this.parser.parseFleet(this.attackers));
    this.fleets.setDefenders(this.parser.parseFleet(this.defenders));
  }
}

berImportController.$inject = ["$scope","berFleets","berParser"];

export const berImport = {
  bindings: {},
  controller: berImportController,
  template: require('./berImport.component.html')
};
